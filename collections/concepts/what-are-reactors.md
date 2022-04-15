---
layout: post
title:  "Reactors"
categories: concepts
permalink: /concepts/what-are-reactors/
nav_order: 5
has_children: true
has_toc: false
image:
path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
width: 1200
height: 630
---

# Reactors

A Reactor is a serverless compute service allowing Node.js code hosted in Basis Theory to be executed against your tokens completely isolated away from your application and systems.

Reactors are invokable from any system that has the ability to make HTTPS requests and access the internet. 

<span class="base-alert info">
  <span>
   Writing your own Node.js compatible Reactors is currently in private beta - reach out if you’re interested in using other languages or access to write your own Node.js Reactors
  </span>
</span>

## **How It Works**

Reactors are serverless function runtimes, similar to AWS Lambda, Azure Functions, or Cloudflare Workers - except your applications, systems, and infrastructure never touches the sensitive plaintext data. 

<img src="/assets/images/concepts/reactors_overview.png">

## Reactor Formulas

Using a Reactor starts with the code you’d like to execute within your system, this code template is referred to as a Reactor Formula. When creating a Reactor Formula you will define the `code`, expected request parameters, and any up-front configuration - like secrets - required to execute your function. Find *an exhaustive list of all configuration options in our [Reactor Formula API Reference.](https://docs.basistheory.com/?shell#reactor-formulas-reactor-formula-object)*

Formulas provide two different response types, giving the flexibility of securing data or returning it as a raw response:

- `tokenize`
    - Any object passed will be [tokenized](https://docs.basistheory.com/#tokenize).
- `raw`
    - Any object passed will be returned from the HTTP request that invoked the Reactor.

```js
module.exports = async function (req) {
  // code to execute
  return {
    tokenize: {
      bar: 'secret' // will be tokenized
    },
    raw: {
      foo: 'plaintext' // will be returned in plaintext
    }
  };
};
```

<span class="base-alert info">
  <span>
   **Quickstart hint:** Find a list of our fully compliant and maintained Official Reactor Formulas from within our [Portal](https://portal.basistheory.com/reactors/formulas)
  </span>
</span>

## Creating a Reactor

Reactors are created with our [Create Reactor endpoint](https://docs.basistheory.com/#reactors-create-reactor). Once configured each Reactor can be invoked - executing the formula it has been configured with. Creating a new Reactor is as simple as passing in the configuration and Formula to be invoked.

```bash
curl "https://api.basistheory.com/reactors" \
  -H "BT-API-KEY: <API_KEY_HERE>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "name": "My First Reactor",
    "configuration": {
      "SERVICE_API_KEY": "key_abcd1234"
    },
    "formula": {
      "id": "17069df1-80f4-439e-86a7-4121863e4678"
    }
  }'
```

<span class="base-alert info">
  <span>
   We encrypt and store each configuration setting in our secure PCI Level 1 and SOC2 environment.
  </span>
</span>

## Invoking a Reactor

Reactors are invoked by an Application with permissions to a specific data [`classification`](https://docs.basistheory.com/#tokens-token-classifications) (for example `token:pii:use:reactor`). This classification enables a Reactor to detokenize tokens matching the specific `classification` your application has been granted. 

```bash
curl "https://api.basistheory.com/reactors/5b493235-6917-4307-906a-2cd6f1a90b13/react" \
  -H "BT-API-KEY: key_N88mVGsp3sCXkykyN2EFED" \
  -X "POST" \
  -d '{
    "args": {
      "card": "{{fe7c0a36-eb45-4f68-b0a0-791de28b29e4}}",
      "customer_id": "myCustomerId1234"
    }
  }'
```

---

## **Common Use Cases**

### Call a 3rd party

Depending on how complex your use case is a Reactor may provide you with an excellent opportunity to mutate data before forwarding it onto a 3rd Party. In the below example, we call httpbin.org (an echo service) with the last 4 characters of our token:

```js
module.exports = async function (req) {
  const fetch = require('node-fetch');
  const { customer_id } = req.args;
  const last4 = customer_id.substring(-4);
  
  const response = await fetch('https://httpbin.org/post', {method: 'POST', body: last4});
  const raw = await resp.json()

  return {
    raw,
  };
};
```

### Create a pdf document

Creating documents out of sensitive data is a primary need for businesses today, especially in fintech where you need to create and submit 1099s for many businesses:

```js
module.exports = async function (req) {
  const fetch = require('node-fetch');
  const PDFDocument = require('pdfkit');
  const { token: { data } } = req.args;
  
  let doc = new PDFDocument;
  doc.fontSize(8)
    .text(`Some token data on a pdf: ${data}`, 1, 1);
  doc.end();
  
  //Send or upload file to your partner
  const response = await fetch('https://httpbin.org/post', {method: 'POST', body: doc});
  const raw = await resp.json()

  return {
    raw,
  };
};
```

### Generate a text file and send to an SFTP server

Many legacy business process still rely heavily on comma delimited files (CVS), tab delimited files or space-delimited files to transport data between companies, typically using SFTP servers as the endpoint of this data. For example, engaging with partner banks with ACH files requires you to format your file correctly and drop it on to an SFTP server. 

```js
module.exports = async function (req) {
  var fs = require("fs");
  var {Client} = require('ssh2');
  const { token: { { prop1, prop2, prop3 } } } = req.args;
  const { host, username, password } = req.configuration;

  var connSettings = { host, port: 22, username, password };  
  var conn = new Client();

  return new Promise((resolve) =>
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        var bufferStream = new require('stream').PassThrough();
        bufferStream.end(Buffer.from(`${prop1},${prop2},${prop3}`, "utf-8"));
        
        const writeStream =  sftp.createWriteStream( "test.csv");
        
        writeStream.on('close',function () {
          res.json({success: true});
          resolve();
        });
        bufferStream.pipe(writeStream);
      });
    }).connect(connSettings));
  };
```

### Import file from a partner

When you need to process files of sensitive data without it touching your systems, use a Reactor to desensitize a file before forwarding it on to your systems for your own logic:

```js
module.exports = async function (req) {
  const { BasisTheory } = require('@basis-theory/basis-theory-js');
  const { fileString } = req.args; // "name,ssn\nTheory,555445555"
  const { BT_API_KEY } = req.configuration;

  const bt = await new BasisTheory().init(BT_API_KEY);
  const rows = fileString.split("\n").map(r => r.split(","));

  await Promise.all(rows.slice(1).map(row => {
    return bt.tokens.create({
      type: 'social_security_number',
      data: row[1],
    }).then(token => row[1] = token.id);
  }));

  const desensitizedFile = rows.map(row => row.join(",")).join("\n");

  res.json({ raw: desensitizedFile}); // "name,ssn\nTheory,14f5c8d4-3e84-4185-96ac-fac6386614dc"
};
```

### Anything you can imagine

When our templates and examples aren’t enough, we enable you to build anything you want to with our Reactors. Start with a blank function like the below and solve any business problem with the data you need:

```js
module.exports = async function (req) {
  const { tokens } = req.args;

  // Anything you can dream up 💭

  return {
    tokenize: { foo: "bar" }, // tokenize data
    raw: { foo: "bar"} // return any data
  };
};
```

---

## FAQ:

### When do I use a Reactor?

When you’re required to write your own code to solve more complex problems - for example when needing to manipulate the data, create a document, or import a file from a partner.

### When would I use the Proxy instead of a Reactor?

When making a simple HTTP request, a simpler implementation can be created using the Proxy. 

### What does the development lifecycle look like for building Reactors?

Each Reactor runs a single function which can be scoped, coded, and tested all within your normal development tooling and lifecycles. Code written and pushed to your own Github repositories can be used to create new Reactor Formulas using our Terraform or [API](https://docs.basistheory.com/#reactor-formulas-reactor-formula-object) integrations.

### Can we run the reactor code locally to test?

Absolutely, each function you write for your Reactors can be run and tested locally. This code can be treated exactly the same as the existing application code you’re deploying to other infrastructure.

### Is there a cold start spin-up time for Reactors?

Our Reactors are designed to be always hot - which allows for fast execution with little spin-up time.

### Is there a concept of “sandbox” Reactors?

Our Reactors follow the same development lifecycle as the rest of our platform, allowing you to create a new Tenant to handle any testing of your platform from your staging or development environments.

### What are the IP addresses for BT?

We have the list of our public [IP addresses here](https://docs.basistheory.com/#ip_addersses).

### How can Reactors reduce the PCI compliance scope of my application?

Using our Reactors allows you to execute code against any PCI classified data, enabling your infrastructure to stay out of PCI compliance.
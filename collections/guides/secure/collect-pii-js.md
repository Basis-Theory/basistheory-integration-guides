---
layout: default
title: Collect Customer Data (PII) with JavaScript
permalink: guides/collect-pii-js/
categories: guides
subcategory: secure
nav_order: 1
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Collect Customer Data (PII) with JavaScript
{: .no_toc }

Basis Theory is built to handle any payload of data you can serialize. The following guide shows how to collect and secure Personal Identifiable Information data in 3 simple steps, keeping it safe and secure.

Using React? Check out the [Collect Customer Data (PII) with React Guide](/guides/collect-pii-react).

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Tokenize your PII data in the browser

<span class="base-alert warning">
  <span>
    To start, you'll need a <code>Elements</code> [Application](https://docs.basistheory.com/api-reference/#applications) with the <code>token:pii:create</code> permission. <a href="https://portal.basistheory.com/applications/create?permissions=token%3Apii%3Acreate&type=elements&name=PII+Collector" target="_blank">Click here to create one.</a>
  </span>
</span>

To get started, you'll need to first start creating tokens out of your customer data. You are able to use our <code>basistheory-js</code> SDK to take values from your frontend and begin tokenizing the data. *(You're also able to create these tokens from your server-side by using the same tokenization code.)*

### Collect data on your frontend application

```js
<div id="customer_form">
  <div class="row">
    <label for="name">Name</label>
    <input id="name" placeholder="Jane Doe" />
  </div>
  <div class="row">
    <label for="phone">Phone</label>
    <input id="phone" placeholder="+55 (55) 55555-5555" />
  </div>
  <div class="row">
    <label for="ssn">"Gov't Id"</label>
    <input id="ssn" placeholder="555-55-5555" />
  </div>
  <button id="submit_button" type="button" onclick="submit()">
    Submit
  </button>
</div>
```

### Tokenize the data with our SDK.

```js
async function submit() {
  const name = document.getElementById("name").value;
  const ssn = document.getElementById("ssn").value;
  const masked_ssn = ssn.substring(ssn.length - 4)
  const phone = document.getElementById("phone").value;

  const bt = await BasisTheory.init('your_api_key');
  const token = await bt.tokens.create({
    type: 'token',
    data: {
      name,
      ssn,
      phone
    },
    privacy: {
      classification: 'pii'
    }
  });
}
```

In the previous example, we are overriding the token's privacy settings to specify a classification of `pii`, which is the type of data we are tokenizing. If we omit this, the default classification `general` would be used. 

## Retrieve your decrypted Token on your server

<span class="base-alert warning">
  <span>
    You'll need a <code>server-to-server</code> api application created with the <code>token:pii:read:high</code> permission for this step. <a href="https://portal.basistheory.com/applications/create?type=server_to_server&permissions=token%3Apii%3Aread%3Ahigh&name=PII+Retriever" target="_blank">Click here to create one.</a>
  </span>
</span>

We suggest only decrypting Token data via your server-side code, this will ensure your <code>server-to-server</code> application keys are never visible in the browser and your sensitive customer data is only revealed to your servers.

```js
const bt = new BasisTheory();
await bt.init(SERVER_KEY);

const token = await bt.tokens.retrieveDecrypted(customerTokenId);

return token;
```

## See it in action
{: .no_toc }

See a sample and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/tokenize-customer-data-ifqz0)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/tokenize-customer-data-ifqz0?fontsize=14&hidenavigation=1&theme=dark" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

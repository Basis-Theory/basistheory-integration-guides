---
layout: default
title: Encrypt U.S Banks in your applications
permalink: /guides/encrypt-us-banks-in-your-applications/
categories: guides
nav_order: 3
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Encrypt U.S Banks in your applications
{: .no_toc }

<span class="base-alert success">
  <span>
    This guide will quickly enable you to be compliant with new Nacha encryption rules. 
  </span>
</span>

Your customer's bank information is as sensitive as their credit card data, and needs to be stored with the same care. Encrypting this data takes a strong encryption pattern, including a KMS, key rotation, multiple encryption keys, access controls, and so much more. 

In this guide, we will show you how to take an existing API and use Basis Theory to safely store the bank data while and retain the exact application functionality. 

If you'd like to follow along with this guide jump right into the code - <a href="https://github.com/Basis-Theory/basis-theory-js-examples/store-atomic-banks">Find it here!</a>

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## The existing application

Below is an existing nodejs application that is currently storing bank data in memory, this will be used as our foundation as we update to more securely store the bank data. 

_(Note: this is only to simplify the guide, the same process will work when storing in a database)_.

### package.json
Our simple `package.json`, only has two dependencies to start. [express](https://www.npmjs.com/package/express) allows us to quickly create an HTTP API, and [nodemon](https://www.npmjs.com/package/nodemon) allows us to have our nodejs application restart automatically.

```js
{
  "name": "bank-data",
  "description": "",
  "version": "1.0.0",
  "author": "Basis Theory",
  "scripts": {
    "start": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "1.18.4"
  }
}
```

### app.json
Our application simply allows a U.S. Bank Account to be sent into the system, stored in memory, and retrieved back. _(Even though our example doesn't show them, your systems will most likely have authentication, databases, etc.)_

```js
const express = require('express')
const app = express()
app.use(express.json());
const port = 3000

// simple storage for this example, this is most likely a DB in your system
let account = {};

// returning the raw bank information
app.get('/get', async (req, res) => {
    res.send(account)
})

// storing the bank information
app.post('/create', async (req, res) => {
    const {accountNumber, routingNumber} = req.body;

    account = {accountNumber, routingNumber};

    res.send()
})

// starting up your API server
app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
```

## Install basis-theory-js

<span class="base-alert warning">
  <span>
    To start, you'll need a new Server to Server Application with the <code>token:bank:create</code> and <code>token:bank:read:high</code> permission
  </span>
</span>

First, you'll need to install the [basis-theory-js](https://www.npmjs.com/package/@basis-theory/basis-theory-js) npm module

```bash
    npm install @basis-theory/basis-theory-js --save
```

## Initialize basis-theory-js 

Next, we will need to initialize `BasisTheory` and store it to be used when banks are being stored:

```js
let basisTheory; // top of your file

// ...

app.listen(port, async () => {
    basisTheory = await new BasisTheory().init("<YOUR API KEY>");

    console.log(`Example app listening at http://localhost:${port}`)
})
```

## Secure your bank data

With your initialized `BasisTheory`, your system can securely store bank information with Basis Theory and store a reference to the data within your database:

```js
app.post('/create', async (req, res) => {
    const {accountNumber, routingNumber} = req.body;

    const atomicBank = await basisTheory.atomicBanks.create({
        bank: {
            routingNumber,
            accountNumber
        }
    });

    account = atomicBank;

    res.send()
})
```

To test that you're now storing this information, you can run this curl command:
```bash
curl --location --request POST 'http://127.0.0.1:3000/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "routingNumber": "021000021",
    "accountNumber": "1234567891099"
}'
```

## Retrieve and return the raw data

After we've stored the information with Basis Theory, we will only be storing a reference to the raw bank account information. With that in mind, we will alter our `/get` endpoint to decrypt and retrieve the bank information and return it from our API:

```js
app.get('/get', async (req, res) => {
    const atomicBank = await basisTheory.atomicBanks.retrieveDecrypted(account.id);
    res.send(atomicBank.bank)
})
```

To test you're retrieving the raw data from your updated endpoint: 

_(keep in mind: every time the sample app restarts you'll need to call `/create`)_ 
```bash
curl --location --request GET 'http://127.0.0.1:3000/get'

/// { "routingNumber": "021000021", "accountNumber": "1234567891099" }
```

Success! You are now securely storing your data with Basis Theory *(who will manage the encryption and keep the data safe on your behalf)*!

## Optional: Add an endpoint to return masked data

Your system may now be safely storing bank information, but how do you make your systems even safer?

Basis Theory by default returns `mask` bank information back to your system, so you're able to store and use this non-sensitive data. These masks allow your systems to ONLY use the raw decrypted bank account data when you absolutely need it!

Below is a new endpoint, showing how you can return the masked data stored in your system:
```js
app.get('/get_mask', (req, res) => {
    res.send(account.bank)
})
```

To test you're retrieving the masked data from your new endpoint:

_(keep in mind: every time the sample app restarts you'll need to call `/create`)_
```bash
curl --location --request GET 'http://127.0.0.1:3000/get_mask'

/// { "routingNumber": "021000021", "accountNumber": "XXXXXXXXX1099" }
```

## Wrap up

You're now able to quickly update your existing systems to encrypt and safely store bank data with Basis Theory, you may now be asking "what's next?" 

- Use our Serverless Reactors to create an ACH file (if you're looking to do this, [reach out!](https://basistheory.com/contact))
- [Never have your systems touch bank data again](/guides/use-us-bank-accounts-without-touching-them) 
- Interact with any other banking service you can imagine (e.g. Dwolla, Plaid, etc)
- [Easily encrypt your existing bank data](https://docs.basistheory.com/api-reference/#tokenize)


## See it in action
{: .no_toc }

Want to see the final result? <a href="https://github.com/Basis-Theory/basis-theory-js-examples/store-atomic-banks">Find it here!</a>

## Watch the video guide

<div class="iframe-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Tj53k37qxSs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
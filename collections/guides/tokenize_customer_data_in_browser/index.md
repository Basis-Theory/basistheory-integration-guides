---
layout: default
title: Tokenize customer data in browser
permalink: guides/tokenize-customer-data-in-browser/
categories: guides
nav_order: 4
has_children: true
has_toc: false
---
# Tokenize customer data in browser
{: .no_toc }

Basis Theory is built to handle any payload of data you can serialize. The following guide will show you how you can easily tokenize your customer's PII (Personally Identifiable Information) data to keep it safe and secure.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Tokenize your PII data in the browser

<span class="base-alert warning">
  <span>
    You'll need a <code>Client-side</code> (Application)[https://docs.basistheory.com/api-reference/#applications] created with the <code>token:create</code> permission for this step.
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
      data: {
        name,
        ssn,
        phone
      }
    });
  }
```

## Retrieve your decrypted Token on your server

<span class="base-alert warning">
  <span>
    You'll need a <code>server-to-server</code> api application created with the <code>token:decrypt</code> permission for this step.
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
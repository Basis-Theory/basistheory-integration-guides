---
layout: default
title: Tokenize customer data in browser
permalink: we_encrypt/tokenize_customer_data_in_browser/
categories: guides
nav_order: 4
has_children: true
has_toc: false
---
# Collect payments with Elements
{: .no_toc }

##### Basis Theory is built to handle any payload of data you can serialize. The following guide will show you how you can easily tokenize your customer's PII (Personally Identifiable Information) data to keep it safe and secure.

{: .no_toc }


### Table of contents
{: .no_toc .text-delta }

1. Tokenize your PII data in the browser
{:toc}


## 1. Tokenize your PII data in the browser

<span class="base-alert warning">
  <span>
    You'll need a <code>public</code> api application created with the <code>token:create</code> permission for this step.
  </span>
</span>

To get started, you'll need to first start creating tokens out of your customer data. You are able to use our <code>basistheory-js</code> SDK to take values from your frontend and begin tokenizing the data. *(You're also able to create these tokens from your server-side by using the same tokenization code.)*

### 1. Collect data on your frontend application

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

### 2. Tokenize the data with our SDK.

```js
  async function submit() {
    const name = document.getElementById("name").value;
    const ssn = document.getElementById("ssn").value;
    const masked_ssn = ssn.substring(ssn.length - 4)
    const phone = document.getElementById("phone").value;

    const bt = await new BasisTheory().init('your_api_key');
    const token = await bt.tokens.create({
      data: JSON.stringify({
        name,
        ssn,
        phone
      })
    });

  ...

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
  async function getCustomerDataFromToken(customerTokenId) {
    const response = await fetch(
      `https://api-dev.basistheory.com/tokens/${customerTokenId}/decrypt`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": SERVER_KEY
        }
      }
    );

    return await response.json();
  }
```

# See it in action:
{: .no_toc }

See a sample and the code that drives it below, want to experience the sandbox yourself? [Check it out here.]("https://codesandbox.io/s/tokenize-customer-data-ifqz0")
<div class="iframe-container">
  <iframe src="https://ifqz0.sse.codesandbox.io/" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

# Want to see you you can own the encryption for this data?
{: .no_toc }

Check out our guides for ["Own encryption client side"]("https://guides.basistheory.com/own-encryption-client-side") and ["Own encryption server side"]("https://guides.basistheory.com/own-encryption-server-side") to learn how to encrypt the data yourself, so Basis Theory isn't able to see your data.
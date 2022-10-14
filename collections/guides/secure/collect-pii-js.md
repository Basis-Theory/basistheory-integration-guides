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
    To start, you'll need a <code>Public</code> [Application](https://docs.basistheory.com/api-reference/#applications) 
    with the <code>token:create</code> permission to the `/pii/` container. 
    <a href="https://portal.basistheory.com/applications/create?application_template_id=da06cf91-caf4-44f4-886a-ab3d71d9ca5f" target="_blank">Click here to create one.</a>
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
    containers: ["/pii/"]
  });
}
```

In the previous example, we are creating the token within the `/pii/` [container](/concepts/what-are-token-containers)
to classify it as PII data. If we omit the `containers` property from the request, the token would be placed in the 
`/general/high/` container by default. 

## Retrieve your Token on your server

<span class="base-alert warning">
  <span>
    To start, you'll need a <code>Private</code> [Application](https://docs.basistheory.com/api-reference/#applications) 
    with the <code>token:read</code> permission to the `/pii/` container. 
    <a href="https://portal.basistheory.com/applications/create?application_template_id=fa77330e-c50d-4f56-a6cb-6342711ae37d" target="_blank">Click here to create one.</a>
  </span>
</span>

We suggest only reading Token data via your server-side code, this will ensure your <code>private</code> application keys are never visible in the browser and your sensitive customer data is only revealed to your servers.

```js
const bt = new BasisTheory();
await bt.init(SERVER_KEY);

const token = await bt.tokens.retrieve(customerTokenId);

return token;
```

## See it in action
{: .no_toc }

See a sample and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/tokenize-customer-data-ifqz0)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/tokenize-customer-data-ifqz0?fontsize=14&hidenavigation=1&theme=dark" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

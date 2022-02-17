---
layout: default
title: Quickstart with Node.js
permalink: /getting-started/quickstart-with-nodejs/
categories: quickstart
nav_order: 1
has_children: true
has_toc: false
description: Get Started with Basis Theory with Node.js
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with Node.js

In this tutorial, you will create a new Node.js script and use Basis Theory’s platform to secure a string of data and then read that data back out. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory allowing you to no longer worry about the underlying storage or encryption of the data.

If you are already familiar with Basis Theory and our platform in general, our guide on [How to send Token data via HTTP](https://developer.basistheory.com/guides/use-token-data-in-http-requests/) or [Collecting payments with Elements](https://developer.basistheory.com/guides/collect-atomic-cards-with-elements/) may be a better place to start.

## Step 1: Get your Node.js environment ready

### Step 1.1: Ensure you have Node.js installed

Completing this tutorial will require you to have Node.js installed on your local system or have an environment you can run your script in. If you’re looking for help getting Node.js installed for your system — check out their [guide on installing](https://nodejs.org/en/download/package-manager/).

### Step 1.2: Create a Node.js script
To start, you’ll need a new Node.js file. Use the following commands (or however you create files) to create a file called `basistheory.js`:

```bash
//Mac or Linux
touch basistheory.js

//Windows
type nul > basistheory.js
```

### Step 2: Import needed dependencies

### Step 2.1: Install the `axios` npm package

To simplify our request to Basis Theory, we will install a helper package called `axios`. Axios is a promise-based HTTP client for Node.js.
```bash
    npm install axios
```

### Step 2.2 Import the `axios` dependency in your script

The simplest form of securing data with Basis Theory is through our API with a JSON body. In Node.js, you can start with just an HTTP client libary, such as Axios. At the top of your file, add the following import statement(s):

```js
const axios = require('axios');
```

## Step 3: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 3.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter “node.js Quickstart”.

<img src="/assets/images/getting_started/application_name_nodejs.png" />

### 3.2 Select Server-to-Server Application Type
The Server-to-Server Application Type enables server-side applications to integrate with the Basis Theory platform directly.

<img src="/assets/images/getting_started/application_type.png" />

### 3.3 Select Permissions
Select `token:general:create` and `token:general:read` [permissions](https://docs.basistheory.com/api-reference/#permissions-permission-object) with “High Impact”. These two permissions allow your Application to create a new Token and read the value back when you need to access it.

<img src="/assets/images/getting_started/application_permissions.png" />

### 3.4 Copy your API key
Keep this API key safe for later. We will use it in the next step to create your first Token.

<img src="/assets/images/getting_started/application_api_key.png" />

## Step 4: Create a Token to secure a string
To create a token, we need to send an HTTP POST request to the [`/tokens`](https://docs.basistheory.com/api-reference/#tokens-create-token) endpoint. In this guide, we will be using the `token` Token Type (you can read more about Tokens [here](https://developer.basistheory.com/concepts/what-are-tokens/)). We have wrapped our calls in a function called `makeMyFirstToken` to simplify `axios` promise response.

Update the `BT-API-KEY` header with the API Key you created in Step 3:

```jsx
const axios = require('axios');

async function makeMyFirstToken() {

    //Create first Token
    const token = await axios.post('https://api.basistheory.com/tokens',
        {
            type: 'token',
            data: 'foo',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'BT-API-KEY': '<! ENTER YOUR API KEY HERE !>'
            }
        })
    
    //Print Token response
    console.log(token.data)
}

// run quickstart code!
makeMyFirstToken();
```

## Step 5: Run your script to create a new Token
To create a token, run the following command in the directory you created your script:

```bash
node basistheory.js
```

You will see a response similar to:
```bash
{
  "id": "0a5767fd-e60a-4d73-bd6e-74b4f1e022df",
  "tenant_id": "71b86f56-e2e4-494c-b4f2-de8f38d1aee1",
  "type": "token",
  "privacy": {
    "classification": "general",
    "impact_level": "high",
    "restriction_policy": "redact"
  },
  "created_by": "69f12e84-4501-41e7-8f51-a74b307d7dc5",
  "created_at": "2022-01-22T15:13:14.3187199+00:00"
}
```

🎉🎉🎉 You’ve created a token 🎉🎉🎉

## Step 6: Read back the raw value from Basis Theory

With our value safely stored in a Token, let’s read that value back to our system. To do this, we will make an HTTP GET request to the [`/tokens/{id}`](https://docs.basistheory.com/api-reference/#tokens-get-a-token) endpoint and print the response's raw string value.

We are using the `token.data.id` from the previous Token we created to inject the `id` into the Get a token request. Update the `BT-API-KEY` header with the API Key you created in Step 3:

```jsx
const readToken = await axios.get(`https://api.basistheory.com/tokens/${token.data.id}`,
    {
        headers: {
            'Content-Type': 'application/json',
            'BT-API-KEY': '<! ENTER YOUR API KEY HERE !>'
        }
    });

//Print token we read
console.log("Read your Token:", readToken.data);
console.log("Read your raw value from the Token:", readToken.data.data);
```

## Step 7: Run the script
Test the entire tutorial out by running the script:
```bash
  node basistheory.js
```

🎉🎉🎉 You’ve successfully created and secured your data and read it back 🎉🎉🎉

```bash
> Create a Token:
{
  "id": "0a5767fd-e60a-4d73-bd6e-74b4f1e022df",
  "tenant_id": "71b86f56-e2e4-494c-b4f2-de8f38d1aee1",
  "type": "token",
  "privacy": {
    "classification": "general",
    "impact_level": "high",
    "restriction_policy": "redact"
  },
  "created_by": "69f12e84-4501-41e7-8f51-a74b307d7dc5",
  "created_at": "2022-01-22T15:13:14.3187199+00:00"
}
Read your Token:
{
  "id": "0a5767fd-e60a-4d73-bd6e-74b4f1e022df",
  "type": "token",
  "tenant_id": "71b86f56-e2e4-494c-b4f2-de8f38d1aee1",
  "data": "foo",
  "created_by": "69f12e84-4501-41e7-8f51-a74b307d7dc5",
  "created_at": "2022-01-22T15:13:14.3187199+00:00",
  "privacy": {
    "classification": "general",
    "impact_level": "high",
    "restriction_policy": "redact"
  }
}
Read your raw value from the Token:
foo
```

## Put it all together
This completes the basic ability to secure data with Tokens and retrieve the raw data back from Basis Theory when you need to use the data in your systems. This flow allows you to secure your data at rest and removes the liability of having the data stored in your databases or having to worry about complex encryption logic.

```jsx
const axios = require('axios');

async function makeMyFirstToken() {

    //Create first Token
    const token = await axios.post('https://api.basistheory.com/tokens',
        {
            type: 'token',
            data: 'foo',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'BT-API-KEY': '<! ENTER YOUR API KEY HERE !>'
            }
        });

    //Print Token response
    console.log("Create a Token:", token.data);

    const readToken = await axios.get(`https://api.basistheory.com/tokens/${token.data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'BT-API-KEY': '<! ENTER YOUR API KEY HERE !>'
            }
        });

    //Print token we read
    console.log("Read your Token:", readToken.data);
    console.log("Read your raw value from the Token:", readToken.data.data);
}

// run quickstart code!
makeMyFirstToken();
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can better secure sensitive data without sacrificing data usability using the Basis Theory platform.

Check out the ability to use your [Token data with HTTP request](https://developer.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://developer.basistheory.com/guides/collect-atomic-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Discord](https://discord.gg/XjWsy8PqK2).

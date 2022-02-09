---
layout: default
title: Quickstart with cURL
permalink: /getting_started/quickstart_with_curl/
categories: quickstart
nav_order: 1
has_children: true
has_toc: false
description: Get Started with Basis Theory and cURL
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with cURL

In this tutorial, using cURL you will learn to use Basis Theory’s platform to secure a string of data and read the data back. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory allowing you to no longer worry about the underlying storage or encryption of the data.

Looking for a Postman library?

If you are already familiar with Basis Theory and our platform in general, our guide on [How to send Token data via HTTP](https://guides.basistheory.com/guides/use-token-data-in-http-requests/) or [Collecting payments with Elements](https://guides.basistheory.com/guides/collect-atomic-cards-with-elements/) may be a better place to start.

## Step 1: Ensure cURL is ready on your system

### Unix/Linux/macOS:

Your system most likely has cURL already installed and you can check with the following command:

```shell
curl --help
```

### Windows
There is a chance that if you have Windows 10 installed, you already have cURL. If the following command doesn’t work — here is help to get [cURL installed](https://stackoverflow.com/a/16216825).

```shell
curl --help
```

## Step 2: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 2.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter “Ruby Quickstart”.

<img src="/assets/images/getting_started/application_name_curl.png" />

### 2.2 Select Server-to-Server Application Type
The Server-to-Server Application Type enables server-side applications to integrate with the Basis theory Platforms directly.

<img src="/assets/images/getting_started/application_type.png" />

### 2.3 Select Permissions
Select `token:general:create` and `token:general:read` [permissions](https://docs.basistheory.com/api-reference/#permissions-permission-object) with the default “Low Impact”. These two permissions allow your Application to create a new Token and read the value back when you need to access it.

<img src="/assets/images/getting_started/application_permissions.png" />

### 2.4 Copy your API key
Keep this API key safe for later. We will use it in the next step to create your first Token.

<img src="/assets/images/getting_started/application_api_key.png" />

## Step 3: Create a Token to secure a string
Below we are making an HTTP POST to our  [Basis Theory Create a Token API](https://docs.basistheory.com/api-reference/#tokens-create-token), we will send a Token type of `token` ([find out more about our Tokens here](https://guides.basistheory.com/concepts/what-are-tokens/)) with a string of “foo”.

Update the `BT-API-KEY` header with the API Key you created in Step 2 and run the following command in your Terminal:

```bash
curl "https://api.basistheory.com/tokens" \
  -H "BT-API-KEY: <! ENTER YOUR API KEY HERE !>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "type": "token",
    "data": "foo"
  }'
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

## Step 4: Read back the raw value from Basis Theory

With our value safely stored in a Token, let’s read that value back to our system. To do this, we will make an HTTP GET request to the [Basis Theory Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token) and print the request’s response and raw string value.

You will need to replace `<! Token Id !>` with the `id` from the response in Step 3 and also replace `<! ENTER YOUR API KEY HERE !>` with your API Key from Step 2 — then run the following command in your Terminal:

```shell
curl "https://api.basistheory.com/tokens/<! Token Id !>" \
  -H "BT-API-KEY: <! ENTER YOUR API KEY HERE !>"
```

🎉🎉🎉 You’ve successfully created a Token for your data and read it back: 🎉🎉🎉

```bash
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
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can take advantage of your tokenized data with the capabilities of the Basis Theory Platform.

Check out the ability to use your [Token data with HTTP request](https://guides.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://guides.basistheory.com/guides/collect-atomic-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Discord](https://discord.gg/XjWsy8PqK2).

---
layout: default
title: Quickstart
permalink: /guides/basis-theory-sample-app/
categories: guides
nav_order: 2
has_children: true
has_toc: false
---
# Take Basis Theory For A Spin
{: .no_toc}

Basis Theory is built to encrypt, decrypt, tokenize, and delegate any payload of data you can serialize. To show the flexibility of our tokenization platform, the following guide will show you how you can tokenize any payload in an application.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Get Started
{: .no_toc }

We are pleased to offer you this 10-step guide and sample application to demonstrate how to tokenize data using Basis Theory. This is an excellent way to quickly get started testing Basis Theory end to end. If you'd rather dive right into the API, run on over to the [sandbox](https://portal.basistheory.com/sandbox).

if you prefer to test out our API directly in Postman, you can quickly get started using our official library: 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/14036973-d1c59e9d-81cb-4d06-b4d9-5b66bdd060b2?action=collection%2Ffork&collection-url=entityId%3D14036973-d1c59e9d-81cb-4d06-b4d9-5b66bdd060b2%26entityType%3Dcollection%26workspaceId%3Dcca928dd-d01d-4c7d-9002-84d5f2b33a63#?env%5BProd%5D=W3sia2V5IjoiYnRfYXBpX2hvc3RuYW1lIiwidmFsdWUiOiJhcGkuYmFzaXN0aGVvcnkuY29tIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJidF9tYW5hZ2VtZW50X2FwaV9rZXkiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiYnRfYXBpX2tleSIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJiYW5rX3JlYWN0b3JfaWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiY2FyZF9yZWFjdG9yX2lkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfV0=)


## Register for Basis Theory

Sign up and validate your e-mail. You can sign up for a free Basis Theory account [here](https://portal.basistheory.com/register).

## Create an Application

Generate your first API key. To generate your first API key head to the [portal](https://portal.basistheory.com/applications) and click "Create New Application" in the Applications tab. Select the following scopes when creating your API Key

- `token:decrypt`
- `token:read`
- `token:create`

After your API key is generated, copy your API key. You'll need it for a future step.

<img src="/assets/images/quickstart/capture_api_key.png">

## Download the Sample Application

Download the sample Basis Theory application. You can download it from [Github](https://github.com/Basis-Theory/basistheory-sample-app-dotnet) or clone the repository

```html
git clone https://github.com/Basis-Theory/basistheory-sample-app-dotnet.git
```

## Go to Directory

Go to the directory where you downloaded the app. If you used git this should be 
```html
cd basistheory-sample-app-dotnet
```

## Run the Application

Run the application by using the following command 
```html
make token
```

## Insert Application API Key

When the app starts add the API key you generated in Step 2.

![Screenshot of sample app api key](/assets/images/quickstart/step_6.png "Screenshot of sample app api key")

## Encrypt your data

Encrypt your first payload. The app gives you the ability to encrypt text or a file. A basic account is limited at a 1mb payload so if you do select a file to encrypt make sure it's under 1mb. After you encrypt and submit the ciphertext via the API, you'll retrieve a token.

![Screenshot of tokenizing data ](/assets/images/quickstart/step_7.png "Screenshot of tokenizing data")

## Decide who encrypts

Decide if you want to encrypt your data using a key pair only you have on your computer, or encrypt using a key pair hosted at Basis Theory. If you use a keypair that is only on your machine all encryption and decryption will be done on your computer. Basis Theory will not be able to decrypt your data.

![Screenshot of how to encrypt](/assets/images/quickstart/step_8.png "Screenshot of how to encrypt")

## Retrieve your token

Now that you've created your first token and encrypted the data behind it. You can now use the API to retrieve the token and the encrypted ciphertext.

![Screenshot of retrieving a token](/assets/images/quickstart/step_9.png "Screenshot of retrieving a token")

## Decrypt your token

Great! You've retrieved the token and the encrypted data along with it. Now you can decrypt it to see the original payload.

![Screenshot of decrypting a token](/assets/images/quickstart/step_10.png "Screenshot of decrypting a token")

## You did it! 
{: .no_toc }

We suggest celebrating this new-found knowledge by going back and repeating steps 7-10 with different types of data and encryption methods. If you're not sure if you want to do that, take a quick 5 second smile.

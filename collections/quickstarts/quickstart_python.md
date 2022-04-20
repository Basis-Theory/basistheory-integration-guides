---
layout: default
title: Quickstart with Python
permalink: /getting-started/quickstart-with-python/
categories: quickstart
nav_order: 3
has_children: true
has_toc: false
description: Get Started with Basis Theory with Python
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with Python

In this tutorial, you will create a new Python script and use Basis Theory’s platform to secure a string of data and then read that data back out. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory, allowing you to no longer worry about the underlying storage or encryption of the data.

If you are already familiar with Basis Theory and our platform in general, our guide on “[How to send Token data via HTTP](https://guides.basistheory.com/guides/use-token-data-in-http-requests/)” or “[Collecting payments with Elements](https://guides.basistheory.com/guides/collect-atomic-cards-with-elements/)” may be better places to start.

<span class="base-alert info">
    <span>
      If you're looking for our Python SDK, you can find it <a href="https://github.com/Basis-Theory/basistheory-python" target="_blank">here.</a>
    </span>
</span>

## Step 1: Get your Python environment ready

### Step 1.1: Ensure you have Python installed

Completing this tutorial will require you to have Python installed on your local system or have an environment you can run your script in. If you’re looking for help getting Python installed for your system — check out their [guide on installing](https://www.python.org/downloads/).

### Step 1.2: Ensure you have Pip installed

To check for `pip` try running the following command, if this command doesn’t work use the following guide to [install it on your system](https://pip.pypa.io/en/stable/installation/).

```bash
pip --help

##if the above doesn't work try
pip3 --help
```

### Step 1.3: Create a Python script

To start, you’ll need a new Python file. Use the following commands (or however you create files) to create a file called `basistheory.py`:

```bash
##Mac or Linux
touch basistheory.py

##Windows
type nul > basistheory.py
```

## Step 2: Import needed dependencies

### Step 2.1: Install the `requests` pip package

To simplify our request to Basis Theory, we will install a helper package called [`requests`](https://docs.python-requests.org/en/latest/). This package simplifies HTTP requests in Python.

```bash
pip install requests

##If you used pip3 above:
pip3 install requests
```

### Step 2.2: Import the `requests` and [`json`](https://docs.python.org/3/library/json.html) dependencies in your script

The simplest form of securing data with Basis Theory is through our API with a JSON body. In Python, this requires a few different libraries to make an API call. At the top of your file, you’ll import the following dependencies:

```python
import requests
import json
```

## Step 3: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 3.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter “Python Quickstart”.

<img src="/assets/images/getting_started/application_name_python.png" />

### 3.2 Select Server-to-Server Application Type
The Server-to-Server Application Type enables server-side applications to integrate with the Basis Theory platform directly.

<img src="/assets/images/getting_started/application_type.png" />

### 3.3 Select Permissions
Select `token:general:create` and `token:general:read` [permissions](https://docs.basistheory.com/api-reference/#permissions-permission-object) with the default “High Impact”. These two permissions allow your Application to create a new Token and read the value back when you need to access it.

<img src="/assets/images/getting_started/application_permissions.png" />

### 3.4 Copy your API key
Keep this API key safe for later. We will use it in the next step to create your first Token.

<img src="/assets/images/getting_started/application_api_key.png" />

## Step 4: Create a Token to secure a string
To create a token, we need to send an HTTP POST request to the [`/tokens`](https://docs.basistheory.com/api-reference/#tokens-create-token) endpoint. In this guide, we will be using the `token` Token Type (you can read more about Tokens [here](https://guides.basistheory.com/concepts/what-are-tokens/)).

Update the `BT-API-KEY` header with the API Key you created in Step 3:

```python
import requests
import json

api_host = "https://api.basistheory.com"
api_key = "key_4qUtg83MpoVnDemfJwbzcN"

headers = {
  "Content-Type": "application/json",
  "BT-API-KEY": api_key
}

# Token object to create
data = {
  "type": "token",
  "data": "foo"
}

# Create token and get response
create_token_res = requests.post(f"{api_host}/tokens", json=data, headers=headers)
token = create_token_res.json()

print("Created Token:")
print(json.dumps(token, indent=2))
```

## Step 5: Run your script to create a new Token
To create a token, run the following command in the directory you created your script:

```bash
python basistheory.py

##if the above doesn't work try
python3 basistheory.py
```

You will see a response similar to:

```bash
Created Token:
{
  "id": "5646e5f5-0075-4932-b08b-77d4250eeea2",
  "tenant_id": "71b86f56-e2e4-494c-b4f2-de8f38d1aee1",
  "type": "token",
  "privacy": {
    "classification": "general",
    "impact_level": "high",
    "restriction_policy": "redact"
  },
  "created_by": "69f12e84-4501-41e7-8f51-a74b307d7dc5",
  "created_at": "2022-02-17T11:49:37.7616114+00:00"
}
```

🎉🎉🎉 You’ve created a token 🎉🎉🎉

## Step 6: Read back the raw value from Basis Theory

With our value safely stored in a Token, let’s read that value back to our system. To do this, we will make an HTTP GET request to the [Basis Theory Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token) endpoint and print the response's raw string value.

We are using the `token.id` from the previous Token we created to inject the `id` into the Get a token request. You can use the same headers with the same `BT-API-KEY` that you used to create the Token:

```python
get_token_res = requests.get(f"{api_host}/tokens/{token['id']}", headers=headers)
fetched_token = get_token_res.json()

print("\nRead your Token:")
print(json.dumps(fetched_token, indent=2)

print("\nRead raw Token data:")
print(fetched_token["data"])
```

## Step 7: Run the script
Test the entire tutorial out by running the script:

```bash
python basistheory.py

##if the above doesn't work try
python3 basistheory.py
```

🎉🎉🎉 You’ve successfully created secured your data and read it back:  🎉🎉🎉

```bash
Created Token:
{
  "id": "5646e5f5-0075-4932-b08b-77d4250eeea2",
  "tenant_id": "71b86f56-e2e4-494c-b4f2-de8f38d1aee1",
  "type": "token",
  "privacy": {
    "classification": "general",
    "impact_level": "high",
    "restriction_policy": "redact"
  },
  "created_by": "69f12e84-4501-41e7-8f51-a74b307d7dc5",
  "created_at": "2022-02-17T11:49:37.7616114+00:00"
}

Read your Token:
{
  "id": "5646e5f5-0075-4932-b08b-77d4250eeea2",
  "type": "token",
  "tenant_id": "71b86f56-e2e4-494c-b4f2-de8f38d1aee1",
  "data": "foo",
  "created_by": "69f12e84-4501-41e7-8f51-a74b307d7dc5",
  "created_at": "2022-02-17T11:49:37.7616114+00:00",
  "privacy": {
    "classification": "general",
    "impact_level": "high",
    "restriction_policy": "redact"
  }
}

Read raw Token data:
foo
```

## Put it all together
This completes the basic ability to secure data with Tokens and retrieve the raw data back from Basis Theory when you need to use the data in your systems. This flow allows you to secure your data at rest, removes the liability of having the data stored in your databases, and frees you from having to worry about complex encryption logic.

```python
import requests
import json

api_host = "https://api.basistheory.com"
api_key = "key_4qUtg83MpoVnDemfJwbzcN"

headers = {
  "Content-Type": "application/json",
  "BT-API-KEY": api_key
}

data = {
  'type': 'token',
  'data': 'foo'
}

create_token_res = requests.post(f"{api_host}/tokens", json=data, headers=headers)
token = create_token_res.json()

print("Created Token:")
print(json.dumps(token, indent=2))

get_token_res = requests.get(f"{api_host}/tokens/{token['id']}", headers=headers)
fetched_token = get_token_res.json()

print("\nRead your Token:")
print(json.dumps(fetched_token, indent=2))

print("\nRead raw Token data:")
print(fetched_token["data"])
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can better secure sensitive data without sacrificing data usability using the Basis Theory platform.

Check out the ability to use your [Token data with HTTP request](https://guides.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://guides.basistheory.com/guides/collect-atomic-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Community](https://community.basistheory.com).

---
layout: default
title: Quickstart with Ruby
permalink: /getting_started/quickstart_with_ruby/
categories: quickstart
nav_order: 1
has_children: true
has_toc: false
description: Get Started with Basis Theory with Ruby
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with Ruby

In this tutorial, you will create a new Ruby script and use Basis Theory’s platform to secure a string of data and then read that data back out. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory allowing you to no longer worry about the underlying storage or encryption of the data.

If you are already familiar with Basis Theory and our platform in general, our guide on [How to send Token data via HTTP](https://guides.basistheory.com/guides/use-token-data-in-http-requests/) or [Collecting payments with Elements](https://guides.basistheory.com/guides/collect-atomic-cards-with-elements/) may be a better place to start.

## Step 1: Get your Ruby environment ready

### Step 1.1: Ensure you have Ruby installed

Completing this tutorial will require you to have Ruby installed on your local system or have an environment you can run your script in. If you’re looking for help getting Ruby installed for your system — check out their guide on [installing](https://www.ruby-lang.org/en/documentation/installation/).

### Step 1.2: Create a Ruby script
To start, you’ll need a new Ruby file. Use the following commands (or however you create files) to create a file called `basistheory.rb`:

```bash
//Mac or Linux
touch basistheory.rb

//Windows
type nul > basistheory.rb
```

### Step 2: Import needed dependencies

The simplest form of securing data with Basis Theory is through our API with a JSON body. In Ruby, this requires a few different libraries to make an API call. At the top of your file, you’ll import the following dependencies:

```ruby
require 'uri'
require 'net/http'
require 'json'
```

## Step 3: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 3.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter “Ruby Quickstart”.

<img src="/assets/images/getting_started/application_name_ruby.png" />

### 3.2 Select Server-to-Server Application Type
The Server-to-Server Application Type enables server-side applications to integrate with the Basis theory Platforms directly.

<img src="/assets/images/getting_started/application_type.png" />

### 3.3 Select Permissions
Select `token:general:create` and `token:general:read` [permissions](https://docs.basistheory.com/api-reference/#permissions-permission-object) with the default “Low Impact”. These two permissions allow your Application to create a new Token and read the value back when you need to access it.

<img src="/assets/images/getting_started/application_permissions.png" />

### 3.4 Copy your API key
Keep this API key safe for later. We will use it in the next step to create your first Token.

<img src="/assets/images/getting_started/application_api_key.png" />

## Step 4: Create a Token to secure a string
Below we are making an HTTP POST to our  [Basis Theory Create a Token API](https://docs.basistheory.com/api-reference/#tokens-create-token), we will send a Token type of `token` ([find out more about our Tokens here](https://guides.basistheory.com/concepts/what-are-tokens/)) with a string of “foo”.

Update the `BT-API-KEY` header with the API Key you created in Step 2:

```ruby
#Create a new Token
res = Net::HTTP.post URI('https://api.basistheory.com/tokens'),
               { "type" => "token", "data" => "foo" }.to_json,
               "Content-Type" => "application/json",
               "BT-API-KEY" => "<! ENTER YOUR API KEY HERE !>"

#Parse Token response into Ruby object
token = JSON.parse(res.body)

#Token response
puts JSON.pretty_generate(token)
```

## Step 5: Run your script to create a new Token
Before moving on, test our script to this point. Run the following command in the directory you created your script:

```bash
ruby basistheory.rb
```

You will see a response similar to:
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
```

🎉🎉🎉 You’ve created a token 🎉🎉🎉

## Step 6: Read back the raw value from Basis Theory

With our value safely stored in a Token, let’s read that value back to our system. To do this, we will make an HTTP GET request to the [Basis Theory Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token) and print the request’s response and raw string value.

We are using the `token["id"]` from the previous Token we created to inject the `id` into the Get a token request. Update the `BT-API-KEY` header with the API Key you created in Step 2:

```ruby
#Read the Token value back form Basis Theory
get_token_res = Net::HTTP.get URI("https://api.basistheory.com/tokens/#{token['id']}"),
               "Content-Type" => "application/json",
               "BT-API-KEY" => "<! ENTER YOUR API KEY HERE !>"

#Parse Token response into Ruby object
raw_value = JSON.parse(get_token_res)

#Display raw Token response
puts JSON.pretty_generate(raw_value)

#Display raw secured value
puts raw_value["data"]
```

## Step 7: Run the script
Test the entire tutorial out by running the script:
```bash
ruby basistheory.rb
```

🎉🎉🎉 You’ve successfully created a Token for your data and read it back: 🎉🎉🎉

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
This completes the basic ability to secure data with Tokens and retrieve the raw data back from Basis Theory when you need to use the data in your systems. This flow allows you to secure your data at rest, removes the liability of having the data stored in your databases, and frees you from having to worry about complex encryption logic.

```ruby
require 'uri'
require 'net/http'
require 'json'

#Create a new Token
res = Net::HTTP.post URI('https://api.basistheory.com/tokens'),
               { "type" => "token", "data" => "foo" }.to_json,
               "Content-Type" => "application/json",
               "BT-API-KEY" => "key_4qUtg83MpoVnDemfJwbzcN"

#Parse Token response into Ruby object
token = JSON.parse(res.body)

#Token response
puts "Create a Token:", JSON.pretty_generate(token)

#Read secured value back form Basis Theory
get_token_res = Net::HTTP.get URI("https://api.basistheory.com/tokens/#{token['id']}"),
               "Content-Type" => "application/json",
               "BT-API-KEY" => "key_4qUtg83MpoVnDemfJwbzcN"

#Parse Token response into Ruby object
raw_value = JSON.parse(get_token_res)

#Display raw Token response
puts "Read your Token:", JSON.pretty_generate(raw_value)

#Display raw secured value
puts "Read your raw value from the Token:", raw_value["data"]
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can take advantage of your tokenized data with the capabilities of the Basis Theory Platform.

Check out the ability to use your [Token data with HTTP request](https://guides.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://guides.basistheory.com/guides/collect-atomic-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Discord](https://discord.gg/XjWsy8PqK2).

---
layout: default
title: Quickstart with .NET
permalink: /getting-started/quickstart-with-dotnet/
categories: quickstart
nav_order: 5
has_children: true
has_toc: false
description: Get Started with Basis Theory with .NET
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with .NET

In this tutorial, you will create a new .NET console application and use Basis Theory’s platform to secure a string of data and then read that data back out. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory allowing you to no longer worry about the underlying storage or encryption of the data.

If you are already familiar with Basis Theory and our platform in general, our guide on [How to send Token data via HTTP](https://developers.basistheory.com/guides/use-token-data-in-http-requests/) or [Collecting payments with Elements](https://developers.basistheory.com/guides/collect-atomic-cards-with-elements/) may be a better place to start.

## Step 1: Get your .NET environment ready

### Step 1.1: Ensure you have .NET installed

Completing this tutorial will require you to have the .NET 6.0 SDK or later installed on your local system. The latest .NET SDK can be [downloaded here](https://dotnet.microsoft.com/en-us/download/dotnet).

### Step 1.2: Create a .NET console application
To start, you will need a new .NET console application. Create a new console application in your IDE of choice named `BasisTheoryQuickstart` or use the following command to create the application:

```bash
mkdir BasisTheoryQuickstart

cd BasisTheoryQuickstart

dotnet new console
```

### Step 2: Import needed dependencies

The simplest form of securing data with Basis Theory is through our API with a JSON body. In .NET, you can start with just an HttpClient, for this example we use the `System.Net.Http` and `System.Text.Json` assemblies to make an API call. At the top of your file, you’ll import the following dependencies:

```csharp
using System.Net.Http.Json;
using System.Text.Json;
```

## Step 3: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 3.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter .NET Quickstart”.

<img src="/assets/images/getting_started/application_name_dotnet.png" />

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
To create a token, we need to send an HTTP POST request to the [`/tokens`](https://docs.basistheory.com/api-reference/#tokens-create-token) endpoint. In this guide, we will be using the `token` Token Type (you can read more about Tokens [here](https://developers.basistheory.com/concepts/what-are-tokens/)).

Update the `BT-API-KEY` header with the API Key you created in Step 3:

```csharp
// Initialize the HttpClient
using var httpClient = new HttpClient
{
    BaseAddress = new Uri("https://api.basistheory.com"),
    DefaultRequestHeaders =
    {
        { "BT-API-KEY", "<! ENTER YOUR API KEY HERE !>" }
    }
};

// Initialize JSON Serializer options
var jsonOptions = new JsonSerializerOptions { WriteIndented = true };

// Create a new Token
var createResponse = await httpClient.PostAsJsonAsync("tokens", new
{
    type = "token",
    data = "foo"
});

// Parse Token response into JSON object
var token = await createResponse.Content.ReadFromJsonAsync<JsonElement>();

// Token response
Console.WriteLine("Create a Token:");
Console.WriteLine(JsonSerializer.Serialize(token, jsonOptions));
```

## Step 5: Run your application to create a new Token
To create a token, run the following command in the directory you created your console application:

```bash
dotnet run
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

With our value safely stored in a Token, let’s read that value back to our system. To do this, we will make an HTTP GET request to the [Basis Theory Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token) endpoint and print the response's raw string value.

We are using the `id` property from the previous Token we created to inject the `tokenId` into the Get a token request. Update the `BT-API-KEY` header with the API Key you created in Step 3:

```csharp
// Read the Token value back form Basis Theory and parse Token response into JSON object
var tokenId = token.GetProperty("id");
var getResponse = await httpClient.GetFromJsonAsync<JsonElement>($"tokens/{tokenId}");

// Display Token response
Console.WriteLine("Read your Token:");
Console.WriteLine(JsonSerializer.Serialize(getResponse, jsonOptions));

// Display raw secured value
Console.WriteLine("Read your raw value from the Token:");
Console.WriteLine(getResponse.GetProperty("data"));
```

## Step 7: Run the application
Test the entire tutorial out by running the application:

```bash
dotnet run
```

🎉🎉🎉 You’ve successfully created a Token for your data and read it back 🎉🎉🎉

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

```csharp
using System.Net.Http.Json;
using System.Text.Json;

// Initialize the HttpClient
using var httpClient = new HttpClient
{
    BaseAddress = new Uri("https://api.basistheory.com"),
    DefaultRequestHeaders =
    {
        { "BT-API-KEY", "<! ENTER YOUR API KEY HERE !>" }
    }
};

// Initialize JSON Serializer options
var jsonOptions = new JsonSerializerOptions { WriteIndented = true };

// Create a new Token
var createResponse = await httpClient.PostAsJsonAsync("tokens", new
{
    type = "token",
    data = "foo"
});

// Parse Token response into JSON object
var token = await createResponse.Content.ReadFromJsonAsync<JsonElement>();

// Token response
Console.WriteLine("Create a Token:");
Console.WriteLine(JsonSerializer.Serialize(token, jsonOptions));

// Read the Token value back form Basis Theory and parse Token response into JSON object
var tokenId = token.GetProperty("id");
var getResponse = await httpClient.GetFromJsonAsync<JsonElement>($"tokens/{tokenId}");

// Display Token response
Console.WriteLine("Read your Token:");
Console.WriteLine(JsonSerializer.Serialize(getResponse, jsonOptions));

// Display raw secured value
Console.WriteLine("Read your raw value from the Token:");
Console.WriteLine(getResponse.GetProperty("data"));
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can better secure sensitive data without sacrificing data usability using the Basis Theory platform.

Check out the ability to use your [Token data with HTTP request](https://developers.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://developers.basistheory.com/guides/collect-atomic-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Community](https://community.basistheory.com).

---
layout: default
title: Quickstart with Go
permalink: /getting-started/quickstart-with-go/
categories: quickstart
nav_order: 6
has_children: true
has_toc: false
description: Get Started with Basis Theory with Go
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with Go

In this tutorial, you will create a new Go application and use Basis Theory’s platform to secure a string of data and then read that data back out. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory allowing you to no longer worry about the underlying storage or encryption of the data.

If you are already familiar with Basis Theory and our platform in general, our guide on [How to send Token data via HTTP](https://developers.basistheory.com/guides/use-token-data-in-http-requests/) or [Collecting payments with Elements](https://developers.basistheory.com/guides/collect-cards-with-elements/) may be a better place to start.

## Step 1: Get your Go environment ready

### Step 1.1: Ensure you have Go installed

Completing this tutorial will require you to have Go installed on your local system. The latest version of Go can be [downloaded here](https://go.dev/doc/install).

### Step 1.2: Create a simple Go module
To start, you will need a new Go module. First, create a new directory to store the quickstart example:

```bash
mkdir BasisTheoryQuickstart
cd BasisTheoryQuickstart
```

Next, initialize a new Go module:

```bash
go mod init BasisTheoryQuickstart
```

Create a new file named `BasisTheoryQuickstart.go` or use the following command to create the file:

```bash
// Mac or Linux
touch BasisTheoryQuickstart.go

// Windows
type nul > BasisTheoryQuickstart.go
```

### Step 2: Import needed dependencies

The simplest form of securing data with Basis Theory is through our API with a JSON body. Basis Theory maintains a Go SDK to make integrating with the platform that much easier. To install the Basis Theory Go SDK and its dependencies, run the following commands:

```go
go get github.com/Basis-Theory/basistheory-go/v3
```

Alternatively, you can import the package directly at the top of your new `BasisTheoryQuickstart.go` module:

```go
import basistheory "github.com/Basis-Theory/basistheory-go/v3"
```

Then run:

```go
go mod tidy
```
‍
_Note: at the time of writing, the latest version was v3. You can find the latest version in our [documentation](https://docs.basistheory.com/?go#getting-started)._

## Step 3: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 3.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter "Go Quickstart”.

<img src="/assets/images/getting_started/application_name_go.png" />

### 3.2 Select Server-to-Server Application Type
The Server-to-Server Application Type enables server-side applications to integrate with the Basis Theory platform directly.

<img src="/assets/images/getting_started/application_type.png" />

### 3.3 Select Permissions
Select `token:general:create` and `token:general:read` [permissions](https://docs.basistheory.com/api-reference/#permissions-permission-object) with the default “High Impact”. These two permissions allow your Application to create a new Token and read the plaintext value back when you need to access it.

<img src="/assets/images/getting_started/application_permissions.png" />

### 3.4 Copy your API key
Keep this API key safe for later. We will use it in the next step to create your first Token.

<img src="/assets/images/getting_started/application_api_key.png" />

## Step 4: Create a Token to secure a string
To create a token, we need to send an HTTP POST request to the [`/tokens`](https://docs.basistheory.com/api-reference/#tokens-create-token) endpoint. In this guide, we will be using the generic `token` Token Type (you can read more about Tokens [here](https://developers.basistheory.com/concepts/what-are-tokens/)).

Update the `BT-API-KEY` header with the API Key you created in Step 3!

(Note: some boilerplate code is missing in this snippet. The complete class is at the bottom of this guide!)

```go
func main() {
  // Initialize new API Client
  configuration := basistheory.NewConfiguration()
  apiClient := basistheory.NewAPIClient(configuration)
  contextWithAPIKey := context.WithValue(context.Background(), basistheory.ContextAPIKeys, map[string]basistheory.APIKey{
    "ApiKey": {Key: "BT-API-KEY"},
  })

  // Initialize the CreateTokenRequest
  createTokenRequest := *basistheory.NewCreateTokenRequest("Sensitive Value")
  createTokenRequest.SetMask("{{ data | reveal_last: 4 }}")
  createTokenRequest.SetType("token")
  createTokenRequest.SetMetadata(map[string]string{
    "myMetadata": "myMetadataValue",
  })
  createTokenRequest.SetSearchIndexes([]string{"{{ data }}", "{{ data | last4}}"})
  createTokenRequest.SetFingerprintExpression("{{ data }}")
  createTokenRequest.SetDeduplicateToken(true)

  privacy := *basistheory.NewPrivacy()
  privacy.SetRestrictionPolicy("mask")
  createTokenRequest.SetPrivacy(privacy)

  // Send the request
  createTokenResponse, _, _ := apiClient.TokensApi.Create(contextWithAPIKey).CreateTokenRequest(createTokenRequest).Execute()

  fmt.Println("Token created:")
  fmt.Printf("%v", createTokenResponse)
}
```

## Step 5: Run your application to create a new Token
To create a token, run the following commands in the directory you initialized your new Go module:

```bash
go run .
```

You will see a response similar to:
```bash
> Token created:
{"id":"62a71684-f148-424c-88c6-bdb44031357a","tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9","type":"token","privacy":{"classification":"general","impact_level":"high","restriction_policy":"redact"},"created_by":"7281f0ef-eafc-455c-bdae-ce6c99ff8268","created_at":"2022-02-17T21:49:29.2596915+00:00"}
```

🎉🎉🎉 You’ve created a token 🎉🎉🎉

## Step 6: Read back the raw value from Basis Theory

With our value safely stored in a Token, let’s read it back. To do this, we will make an HTTP GET request to the [Basis Theory Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token) endpoint and print the response's raw string value.

We are using the `id` property from the previous Token we created to inject the `tokenId` into the Get a token by ID request.

```go
token, httpResponse, err := apiClient.TokensApi.GetById(contextWithAPIKey, createTokenResponse.GetId()).Execute()

fmt.Println("Read a token:")
fmt.Printf("%v", token)
```

## Step 7: Run the application
Test the entire tutorial out by running the application:

```bash
go run .
```

🎉🎉🎉 You’ve successfully created a Token for your data and read it back 🎉🎉🎉

```bash
> Token created:
{"id":"62a71684-f148-424c-88c6-bdb44031357a","tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9","type":"token","privacy":{"classification":"general","impact_level":"high","restriction_policy":"redact"},"created_by":"7281f0ef-eafc-455c-bdae-ce6c99ff8268","created_at":"2022-02-17T21:49:29.2596915+00:00"}
Read a token:
{"id":"62a71684-f148-424c-88c6-bdb44031357a","type":"token","tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9","created_by":"7281f0ef-eafc-455c-bdae-ce6c99ff8268","created_at":"2022-02-17T21:49:29.2596915+00:00","privacy":{"classification":"general","impact_level":"high","restriction_policy":"redact"}}
```

## Putting it all together
This completes the basic ability to secure data with Tokens and retrieve the raw data back from Basis Theory when you need to use the data in your systems. This flow allows you to secure your data at rest, removes the liability of having the data stored in your databases, and frees you from having to worry about complex encryption logic.

```go
package main

import (
  "context"
  "fmt"
  "github.com/Basis-Theory/basistheory-go/v3"
)

func main() {
  // Initialize new API Client
  configuration := basistheory.NewConfiguration()
  apiClient := basistheory.NewAPIClient(configuration)
  contextWithAPIKey := context.WithValue(context.Background(), basistheory.ContextAPIKeys, map[string]basistheory.APIKey{
    "ApiKey": {Key: "BT-API-KEY"},
  })

  // Initialize the CreateTokenRequest
  createTokenRequest := *basistheory.NewCreateTokenRequest("Sensitive Value")
  createTokenRequest.SetMask("{{ data | reveal_last: 4 }}")
  createTokenRequest.SetType("token")
  createTokenRequest.SetMetadata(map[string]string{
    "myMetadata": "myMetadataValue",
  })
  createTokenRequest.SetSearchIndexes([]string{"{{ data }}", "{{ data | last4}}"})
  createTokenRequest.SetFingerprintExpression("{{ data }}")
  createTokenRequest.SetDeduplicateToken(true)

  privacy := *basistheory.NewPrivacy()
  privacy.SetRestrictionPolicy("mask")
  createTokenRequest.SetPrivacy(privacy)

  // Send the request
  createTokenResponse, _, _ := apiClient.TokensApi.Create(contextWithAPIKey).CreateTokenRequest(createTokenRequest).Execute()

  fmt.Println("Token created:")
  fmt.Printf("%v", createTokenResponse)

  // Read the token
  token, _, _ := apiClient.TokensApi.GetById(contextWithAPIKey, createTokenResponse.GetId()).Execute()

  fmt.Println("Read a token:")
  fmt.Printf("%v", token)
}
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can better secure sensitive data without sacrificing data usability using the Basis Theory platform.

Check out the ability to use your [Token data with HTTP request](https://developers.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://developers.basistheory.com/guides/collect-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Community](https://community.basistheory.com).

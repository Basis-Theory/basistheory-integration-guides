---
layout: default
title: Quickstart with Java
permalink: /getting-started/quickstart-with-java/
categories: quickstart
nav_order: 4
has_children: true
has_toc: false
description: Get Started with Basis Theory with Java
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Quickstart with Java

In this tutorial, you will create a new Java application and use Basis Theory’s platform to secure a string of data and then read that data back out. Once you’ve completed this tutorial, you’ll have a foundational understanding of how to secure your data with Basis Theory allowing you to no longer worry about the underlying storage or encryption of the data.

If you are already familiar with Basis Theory and our platform in general, our guide on [How to send Token data via HTTP](https://developers.basistheory.com/guides/use-token-data-in-http-requests/) or [Collecting payments with Elements](https://developers.basistheory.com/guides/collect-atomic-cards-with-elements/) may be a better place to start.

## Step 1: Get your Java environment ready

### Step 1.1: Ensure you have Java installed

We will use vanilla Java, without external dependencies. Completing this tutorial will require you to have the Java SE 17 or later installed on your local system. The latest version of Java can be [downloaded here](https://www.oracle.com/java/technologies/downloads/); OpenJDK can be [downloaded here](https://jdk.java.net/).

### Step 1.2: Create a simple Java class file
To start, you will need a new Java class file.  Create a new file named `BasisTheoryQuickstart.java` or use the following command to create the application:

```bash
// Mac or Linux
touch BasisTheoryQuickstart.java

// Windows
type nul > BasisTheoryQuickstart.java
```

### Step 2: Import needed dependencies

The simplest form of securing data with Basis Theory is through our API with a JSON body. In Java 11 or later, you can start with just an HttpClient. For this example we use the `java.net.http.HttpClient` and related packages to make an API call. At the top of your file, you’ll import the following dependencies:

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
```

## Step 3: Create a new Application in your Basis Theory Account

If you don’t already have a Basis Theory account and your first Tenant, create one [here](https://portal.basistheory.com/register).

Within your Basis Theory account, create a new Application. To create a new application, head to our portal [here](https://portal.basistheory.com/applications/create) — this Application’s API Key will enable you to authenticate with the Basis Theory platform and create Tokens within your Tenant.

### 3.1 Enter an Application Name
This name allows you to identify this application in the future — for this tutorial enter "Java Quickstart”.

<img src="/assets/images/getting_started/application_name_java.png" />

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

```java
// Initialize the HttpClient
var client = HttpClient.newHttpClient();

// JSON message formatted as a string
var message = "{\"type\": \"token\", \"data\": \"foo\"}";

var createRequest = HttpRequest.newBuilder()
    .uri(URI.create("https://api.basistheory.com/tokens"))
    .POST(BodyPublishers.ofString(message))
    .header("Content-type", "application/json")
    .header("Accept", "application/json")
    // Enter your API key here!
    .header("BT-API-KEY", "<! ENTER YOUR API KEY HERE !>")
    .build();

// Create a new token
var createResponse = client.send(createRequest, BodyHandlers.ofString());
var token = createResponse.body();

// Token response
System.out.println("Token created:");
System.out.println(token);
```

## Step 5: Run your application to create a new Token
To create a token, run the following commands in the directory you created your `BasisTheoryQuickstart.java` file:

```bash
javac BasisTheoryQuickstart.java
java BasisTheoryQuickstart
```

You will see a response similar to:
```bash
> Token created:
{"id":"62a71684-f148-424c-88c6-bdb44031357a","tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9","type":"token","privacy":{"classification":"general","impact_level":"high","restriction_policy":"redact"},"created_by":"7281f0ef-eafc-455c-bdae-ce6c99ff8268","created_at":"2022-02-17T21:49:29.2596915+00:00"}
```

🎉🎉🎉 You’ve created a token 🎉🎉🎉

## Step 6: Read back the raw value from Basis Theory

With our value safely stored in a Token, let’s read it back. To do this, we will make an HTTP GET request to the [Basis Theory Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token) endpoint and print the response's raw string value.

We are using the `id` property from the previous Token we created to inject the `tokenId` into the Get a token by ID request. Because we are using vanilla Java, we will simply split the response and grab the `id` from the resulting array.

```java
// Parse token id from response
var tokenArray = token.split("\"");
var tokenId = tokenArray[3];

// Get token
var getRequest = HttpRequest.newBuilder()
    .uri(URI.create(String.format("https://api.basistheory.com/tokens/%s", tokenId)))
    .GET()
    .header("Content-type", "application/json")
    .header("Accept", "application/json")
    .header("BT-API-KEY", "key_E6gVJEn1DRT5m6YHs55Dsa")
    .build();

var getResponse = client.send(getRequest, BodyHandlers.ofString());
System.out.println("Read a token:");
System.out.println(getResponse.body());
```

## Step 7: Run the application
Test the entire tutorial out by running the application:

```bash
javac BasisTheoryQuickstart.java
java BasisTheoryQuickstart
```

🎉🎉🎉 You’ve successfully created a Token for your data and read it back 🎉🎉🎉

```bash
> Create a token:
{"id":"62a71684-f148-424c-88c6-bdb44031357a","tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9","type":"token","privacy":{"classification":"general","impact_level":"high","restriction_policy":"redact"},"created_by":"7281f0ef-eafc-455c-bdae-ce6c99ff8268","created_at":"2022-02-17T21:49:29.2596915+00:00"}
Read a token:
{"id":"62a71684-f148-424c-88c6-bdb44031357a","type":"token","tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9","created_by":"7281f0ef-eafc-455c-bdae-ce6c99ff8268","created_at":"2022-02-17T21:49:29.2596915+00:00","privacy":{"classification":"general","impact_level":"high","restriction_policy":"redact"}}
```

## Putting it all together
This completes the basic ability to secure data with Tokens and retrieve the raw data back from Basis Theory when you need to use the data in your systems. This flow allows you to secure your data at rest, removes the liability of having the data stored in your databases, and frees you from having to worry about complex encryption logic.

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

public class BTQuickstart {

    public static void main(String[] args) {
        try {
            // Initialize the HttpClient
            var client = HttpClient.newHttpClient();

            // JSON message formatted as a string
            var message = "{\"type\": \"token\", \"data\": \"foo\"}";

            var createRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.basistheory.com/tokens"))
                .POST(BodyPublishers.ofString(message))
                .header("Content-type", "application/json")
                .header("Accept", "application/json")
                // Enter your API key here!
                .header("BT-API-KEY", "key_E6gVJEn1DRT5m6YHs55Dsa")
                .build();

            // Create a new token
            var createResponse = client.send(createRequest, BodyHandlers.ofString());
            var token = createResponse.body();

            // Token response
            System.out.println("Create a token:");
            System.out.println(token);

            // Parse token id from response
            var tokenArray = token.split("\"");
            var tokenId = tokenArray[3];

            // Get token
            var getRequest = HttpRequest.newBuilder()
                .uri(URI.create(String.format("https://api.basistheory.com/tokens/%s", tokenId)))
                .GET()
                .header("Content-type", "application/json")
                .header("Accept", "application/json")
                .header("BT-API-KEY", "key_E6gVJEn1DRT5m6YHs55Dsa")
                .build();

            var getResponse = client.send(getRequest, BodyHandlers.ofString());
            System.out.println("Read a token:");
            System.out.println(getResponse.body());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## What can I do next?

Now that you understand the basics, you are ready to learn more about how you can better secure sensitive data without sacrificing data usability using the Basis Theory platform.

Check out the ability to use your [Token data with HTTP request](https://developers.basistheory.com/guides/use-token-data-in-http-requests/) without the data ever touching your systems — or if you’re looking to secure Credit Card data, check out our guide on [How To Charge a customer with Stripe](https://developers.basistheory.com/guides/collect-atomic-cards-with-elements/) while retaining access to the credit card number for future transactions.

Was this useful, or looking for something different? Reach out to us on our [Community](https://community.basistheory.com).

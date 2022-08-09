---
layout: default
title: Use Token Data in HTTP Requests
permalink: /guides/use-token-data-in-http-requests/
categories: guides
subcategory: use
nav_order: 4
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Use Token Data in HTTP Requests
{: .no_toc }

In this guide, we will walk through how to use the Proxy to send an outbound HTTP request containing sensitive detokenized data.

We will be leveraging the third party service https://httpbin.org/ as our external destination API. 
HTTPBin is a free service that will accept any input request and respond with information about the request it received. 
This will allow us to inspect the manipulated request that was forwarded from the Proxy to the destination API.

If you would like to learn more about the Basis Theory Proxy first, or how this product can help you meet your security and compliance needs, check out [What is the Proxy?](/concepts/what-is-the-proxy) before continuing.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Prerequisites

### Application Setup

We will be creating and proxying tokens that contain PCI data in this example.
First, we need to ensure we have a `Private` application configured that has `token:pci:create` and `token:pci:use:proxy` permissions.
We will be using the API Key associated with this application in all HTTP requests below. <a href="https://portal.basistheory.com/applications/create?permissions=token%3Apci%3Ause%3Aproxy&permissions=token%3Apci%3Acreate&type=private&name=Card+Proxy" target="_blank">Click here to create it.</a>

<span class="base-alert info">
  <span>
    The Proxy requires the `token:<classification>:use:proxy` permission for each classification of token that you wish to include in the proxy request. 
    For more information about Proxy permissions, see <a href="https://docs.basistheory.com/api-reference/#permissions-permission-types">our docs</a>.
  </span>
</span>

### Create a Token

Next, we will create a `card_number` token containing a credit card number we wish to secure with Basis Theory.

```js
    curl "https://api.basistheory.com/tokens" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "type": "card_number",
            "data": "6011111111111117"
        }'
```

This responds with the created token:

```js
{
    "id": "a70f8701-8b65-476b-ac0a-21bcd7d943d5",
    "type": "card_number",
    "data": "XXXXXXXXXXXX1117",
    ...
}
```

We will be using the id of this token below to build a request to the Proxy.

## Create the Proxy Request

In this example, we will be working with a hypothetical third party HTTP API that requires credit card information as input. 
This API will be available at `https://httpbin.org/anything` and it expects an HTTP POST request with a request body of the form:
```js
{
  "firstName": <string>,
  "lastName": <string>,
  "creditCardNumber": <string>,
  "expirationDate": <string>
}
```

Our hypothetical source system will be storing plaintext first names, last names, and expiration dates of card numbers, as these fields are considered non-sensitive.
However, in order to minimize the compliance and security risk of our application, we do not want our application to store or even interact with raw credit card numbers when building this HTTP request.

Instead, we will send a request to the Basis Theory Proxy which contains the non-sensitive data fields and the `id` of the `card_number` token we wish to include in the request.

```js
{
    "firstName": "John",
    "lastName": "Doe",
    "creditCardNumber": "{%raw%}{{a70f8701-8b65-476b-ac0a-21bcd7d943d5}}{%endraw%}",
    "expirationDate": "10/2024"
}
```

The expression `{%raw%}{{a70f8701-8b65-476b-ac0a-21bcd7d943d5}}{%endraw%}` within the request will be identified by the Proxy, and the raw credit card number represented by this token will be substituted in its place.


## Send the Proxy Request Containing Detokenized Values

In order to send this request payload into the Basis Theory Proxy a few additional pieces of information are required as HTTP headers:
- BT-API-KEY: the API key of the Basis Theory application we created earlier
- BT-PROXY-URL: the destination url to which the request should be forwarded (`https://httpbin.org/anything`)
- BT-PROXY-KEY: the `key` of the pre-configured [proxy](https://docs.basistheory.com/#proxies-proxy-object) to use for this request

```js
curl "https://api.basistheory.com/proxy" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "BT-PROXY-URL: https://httpbin.org/anything" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "firstName": "John",
            "lastName": "Doe",
            "creditCardNumber": "{%raw%}{{a70f8701-8b65-476b-ac0a-21bcd7d943d5}}{%endraw%}",
            "expirationDate": "10/2024"
        }'
```

This sends the request through the Proxy, which transforms the request before forwarding it onto the destination service at HTTPBin. 
HTTPBin returns the following response describing the request that it received, and this response is forwarded back through the proxy (some information is redacted for brevity):

```js
{
  "data": "{ \"firstName\": \"John\", \"lastName\": \"Doe\", \"creditCardNumber\": \"6011111111111117\", \"expirationDate\": \"10/2024\" }",
  "headers": {
    ...
    "Content-Type": "application/json",
    "Host": "httpbin.org",
    "X-Forwarded-Host": "api.basistheory.com",
    "X-Forwarded-Tlsversion": "1.2",
    ...
  },
  "json": {
    "creditCardNumber": "6011111111111117",
    "expirationDate": "10/2024",
    "firstName": "John",
    "lastName": "Doe"
  },
  "method": "POST",
  ...
}
```

As we can see from this response, the request received by the destination service included the original raw credit card number that had been tokenized with Basis Theory.
The other non-sensitive data fields that were provided in plaintext were forwarded in the request without modification.

This was just a basic example of what you can accomplish using the Proxy. If you're interested in some of the more advanced proxying features, 
check out our docs on the [Proxy](https://docs.basistheory.com/#proxy) or [Detokenization](https://docs.basistheory.com/expressions/#detokenization) to learn more!

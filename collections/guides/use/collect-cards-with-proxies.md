---
layout: default
title: Collect and Use Credit Cards with Proxies
permalink: /guides/collect-cards-with-proxies/
categories: guides
subcategory: use
nav_order: 6
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Collect and Use Credit Cards with Proxies
{: .no_toc }

By the end of this guide, you will have learned how to use Basis Theory’s Proxies to accept Credit Card data in your API - All without touching the card data or pulling your system into PCI scope. In this example, we will configure the Proxy to utilize a Reactor to remove any sensitive data, forward the desensitized request to your API, and finally respond to the originator.

For this guide, we will be using the following scenario:

- We will accept card data via our API from one of our partners. The request body will be as follows:
  ```json
  {
      "merchantAccount": "TestMerchant",
      "card": {
          "expiryMonth": "8",
          "expiryYear": "2018",
          "holderName": "Test",
          "number": "4111111111111111"
      }
  }
  ```
- We will tokenize the credit card number
- We will forward the request with the new tokenized card to `https://api.acme.com/payment`
- Once `https://api.acme.com/payment` responds, this response will become the response to our partner’s original call.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## 1. Create a new Management Application

This new management Application will be used to create new Reactor Formulas, [Reactors](https://developers.basistheory.com/concepts/what-are-reactors/), [Applications](https://developers.basistheory.com/concepts/what-are-applications/), and the [Proxy](https://developers.basistheory.com/concepts/what-is-the-proxy/). To enable this configuration, we will configure the Application with the following settings:

- Name
    - “Setup Proxy”
- Permissions
    - `application:create`
    - `reactor:create`
    - `proxy:create`

[You can use this link to pre-fill the Create Application form in our Portal.](https://portal.basistheory.com/applications/create?name=Setup+Proxy&permissions=application%3Acreate&permissions=reactor%3Acreate&permissions=proxy%3Acreate&type=management)

*Make sure you remember the `key` of this new Application, you’ll use this in the following Steps.*

## 2. Create a Reactor Formula to handle the inbound request

We will first create a new Reactor Formula to tokenize the card number in the inbound request. This [Reactor Formula](https://docs.basistheory.com/#reactor-formulas) will tokenize the card number and return a new `body` with the raw card number replaced with our newly created [Token](https://developers.basistheory.com/concepts/what-are-tokens/).

We will use the following code to create our new Reactor Formula:

```jsx
module.exports = async function (req) {
  const token = await req.bt.tokenize({
    type: "token",
    data: req.args.body.card.number,
      privacy: {
          classification: "pci",
          impactLevel: "high"
      }
  });
 
  const body = {
    ...req.args.body,
    card: {
      ...req.args.body.card,
      number: token.id
    }
  }

  return {
    raw: {
      headers: req.args.headers,
      body
    }
  };
};
```

Use the following `curl` command to create a new Reactor Formula:

```bash
curl "https://api.basistheory.com/reactor-formulas" \
  -H "BT-API-KEY: <API Key from Step 1>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "type": "private",
    "status": "verified",
    "name": "Partner Proxy Formula",
    "description": "Used to tokenized cards on the way to /payments",
    "icon": "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
    "code": "module.exports = async function (req) {\r\n  const token = await req.bt.tokenize({\r\n\t  type: \"token\",\r\n\t  data: req.args.body.card.number,\r\n\t\tprivacy: {\r\n\t\t\tclassification: \"pci\",\r\n\t\t\timpactLevel: \"high\"\r\n\t\t}\r\n\t});\r\n \r\n\tconst body = {\r\n\t\t...req.args.body,\r\n    card: {\r\n      ...req.args.body.card,\r\n      number: token.id\r\n    }\r\n\t}\r\n\r\n  return {\r\n\t\traw: {\r\n\t\t\theaders: req.args.headers,\r\n\t\t\tbody\r\n\t\t}\r\n\t};\r\n};",
    "configuration": [],
    "request_parameters": []
}'
```

*Make sure you remember the `id` of this new Reactor Formula, you’ll use this in Step 3.*

## 3. Create a new Application

This Application will be used by your Reactor to grant the injected `bt` [npm module](https://www.npmjs.com/package/@basis-theory/basis-theory-js) instance access to create new `pci` classification tokens.

Create a new Application with the following settings:

- Name
    - Create and Use Reactors Application
- Types
    - Server to Server
- Permissions
    - `token:pci:create`
    - `token:pci:use:reactor`

[Click here to have pre-fill a new Create Application](https://portal.basistheory.com/applications/create?name=Create+and+Use+Reactors+Application&permissions=token%3Apci%3Ause%3Areactor&permissions=token%3Apci%3Acreate&type=server_to_server) or you can use the following API call with your Management API Key from Step 1:

```bash
curl "https://api.basistheory.com/applications" \
  -H "BT-API-KEY: <API Key from Step 1>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "name": "Create and Use Reactors Application",
    "type": "server_to_server",
    "permissions": [
      "token:pci:create",
      "token:pci:use:reactor"
    ]
  }'
```

*Make sure you remember the `id` of this new Application, you’ll use this in Step 4. When creating the Application through the Portal, you can find the Application `id` in the last part of the URL path when viewing details for the Application.*

## 4. Create a new Reactor

Use the following `curl` command to create a new Reacotr using the Reactor Formula id we’ve created in Step 2 and the Application id created in Step 3:

```bash
curl "https://api.basistheory.com/reactors" \
  -H "BT-API-KEY: <API Key from Step 1>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "name": "Partner Proxy",
    "application": {
      "id": "<Application Id from Step 3>"
    },
    "formula": {
      "id": "<Reactor Formula Id from Step 2>"
    }
  }'
```

*Make sure you remember the `id` of this new Reactor, you’ll use this in Step 5.*

## 5. Create a new Proxy

Using our newly created Reactor (from Step 4) configure a new Proxy. When created, a new `key` will be generated for that Proxy. When that Proxy is used it will invoke the specified Reactor and forward the output to your specified `destination_url`. Anything responded from your `destination_url` will be ultimately returned to the original caller.

Use the following `curl` command to create a proxy:

```bash
curl "https://api.basistheory.com/proxies" \
  -H "BT-API-KEY: <API Key from Step 1>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "name": "Partner Proxy",
    "request_reactor_id": "<Reactor Id from Step 4>",
    "destination_url": "https://api.acme.com/payment"
  }'
```

This will respond with the following:

```json
{
  "id": "e3337cfe-3e50-45b9-a847-e29a50980ca5",
  "tenant_id": "c290ba6f-9214-4de1-8948-9f0fe2481807",
  "name": "Partner Proxy",
  "key": "e29a50980ca5",
  "request_reactor_id": "<Reactor Id from Step 4>",
  "destination_url": "https://api.acme.com/payment",
  "require_auth": true,
  ...
}
```

*Make sure you remember the `key` of this new Proxy, you’ll use this in Step 7.*

## 6. Create a new Application for our partner

By default, all Proxies require auth. In order to grant access to call a Proxy, we'll need to create a new Application with permissions to use this Proxy.

Create a new Application with the following settings:

- Name
    - Partner Application
- Types
    - Server to Server
- Permissions
    - `token:pci:use:proxy`

[Click here to have pre-fill a new Create Application](https://portal.basistheory.com/applications/create?permissions=token%3Apci%3Ause%3Aproxy&type=server_to_server&name=Partner+Application) or you can use the following API call with your Management API Key from Step 1:

```bash
curl "https://api.basistheory.com/applications" \
  -H "BT-API-KEY: <API Key from Step 1>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "name": "Partner Application",
    "type": "server_to_server",
    "permissions": [
      "token:pci:use:proxy"
    ]
  }'
```

*Make sure you remember the `key` of this new Application, you’ll use this in Step 7.*

## 7. Call the new Proxy

Using the new Proxy endpoint our partner can call this endpoint:

```bash
curl "https://api.basistheory.com/proxy" \
  -H "BT-API-KEY: <API Key from Step 6>" \
  -H "BT-PROXY-KEY: <Proxy Key from Step 5>" \
  -X "POST" \
  -d '{
    "merchantAccount": "TestMerchant",
    "card": {
        "expiryMonth": "8",
        "expiryYear": "2018",
        "holderName": "Test",
        "number": "4111111111111111"
    }
  }'
```

The response will be the following:

```json
{
  "merchantAccount": "TestMerchant",
  "card": {
    "expiryMonth": "8",
    "expiryYear": "2018",
    "holderName": "Test",
    "number": "1767a42d-0b1a-400d-8f20-7e35daaf2547"
  }
}
```

🎉 Success!

After placing this call, your endpoint at https://api.acme.com/payment will be triggered and the curl command from Step 6 will have the response from this endpoint.

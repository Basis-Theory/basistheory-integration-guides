---
layout: default
title: Run Your Own Code in a Reactor
permalink: /guides/run-your-own-code-in-a-reactor/
categories: guides
subcategory: use
nav_order: 5
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Run Your Own Code in a Reactor
{: .no_toc }

Basis Theory offers several pre-built Official Reactor Formulas that support standard integrations with popular Third Party systems.
While these Official formulas are helpful to quickly get up and running for common use cases, we understand that 
every business has unique needs and challenges around how they use their data, and oftentimes custom code is required to achieve these goals.
In this guide, we will walk through how to create a Private Reactor Formula to run your own custom code. 

If you are completely new to Reactors and would like to first learn the basics, check out our 
[Reactors](/concepts/what-are-reactors/) concept page. If you'd rather learn about how to use one of our 
Official Reactor Formulas, check out our guide on how to [Use Token Data in Reactors](/guides/use-token-data-in-reactors/).

<span class="base-alert info">
  <span>
    Private Reactor Formulas are only currently available to members of our Private Beta program. If you're interested in 
    creating a Reactor with your own custom code, <a href="https://support.basistheory.com/hc/requests/new?tf_subject=Join%20Beta%20Program%20to%20Code%20Your%20Own%20Reactor&amp;tf_description=Let%20us%20know%20what%20you'd%20like%20to%20do%20with%20your%20Reactor&amp;tf_priority=normal" target="_blank">click here to request access</a>!
  </span>
</span>

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## How to Configure a Reactor Formula

When defining a Reactor Formula, you have a few options for providing input data to be used within your custom code.

[Configuration](https://docs.basistheory.com/#reactor-formulas-reactor-formula-configuration) is used to declare 
parameters that will be defined once per Reactor and do not change between Reactor invocations.
Declare a configuration property on a Reactor Formula for each property you wish to be statically defined, 
such as an API key for a third-party API, or an environment variable.

[Request Parameters](https://docs.basistheory.com/#reactor-formulas-reactor-formula-request-parameters) are used to declare
parameters that will be provided with every Reactor invocation and are expected to vary between requests.
Declare a request parameter on a Reactor Formula for each property you wish to supply at runtime,
such as a user's card number or a transaction amount.

The `args` provided with each request to [invoke a Reactor](https://docs.basistheory.com/#reactors-invoke-a-reactor) are
validated against the request parameter declarations on the Reactor Formula. To access sensitive data within a Reactor Formula, 
tokens may be provided within the `args` to satisfy the request parameter contract - 
requests to invoke a Reactor are first [detokenized](https://docs.basistheory.com/expressions/#detokenization) 
to replace any detokenization expressions within the `args` and the request provided to the Reactor Formula Code will contain
your detokenized sensitive data.

## How to Write Code for a Reactor Formula

Reactors provide an isolated serverless Node.js v14 runtime in which your custom code is securely executed. 
Reactor Formulas are written using (Node.js v14-compatible) Javascript and have the following general structure:

```js
module.exports = async function (req) {
  const { my_arg } = req.args; // access any args provided with the request
  const { MY_CONFIG } = req.configuration; // access any static config defined on the Reactor

  // do anything here!

  return {
    raw: {}, // non-sensitive data that should be returned in plaintext
    tokenize: {} // sensitive data that should be tokenized
  };
};
```

<span class="base-alert info">
  <span>
    If you're interested in writing custom Reactor Formulas using a language other than Javascript, please reach out and 
    <a href="https://support.basistheory.com/hc/requests/new?tf_subject=Reactor%20Formula%20Language%20Request&amp;tf_description=Let%20us%20know%20what%20language%20you'd%20prefer&amp;tf_priority=normal" target="_blank">let us know</a>!
  </span>
</span>

The [request](https://docs.basistheory.com/#reactor-formulas-reactor-formula-code) object provided to a Reactor Formula contains the following properties:
- `args`: [detokenized](https://docs.basistheory.com/expressions/#detokenization) runtime arguments provided when invoking the Reactor
- `configuration`: static [configuration](https://docs.basistheory.com/#reactor-formulas-reactor-formula-configuration) defined with the Reactor

The [response](https://docs.basistheory.com/#reactor-formulas-reactor-formula-code) returned from a Reactor Formula may contain the following properties:
- `raw`: non-sensitive data that will be returned in plaintext
- `tokenize`: sensitive data that will be tokenized before returning it in the response

Exercise caution when returning plaintext data within the `raw` portion of the response - the systems that invoke your 
Reactor will receive this raw data in the HTTP response and returning sensitive data in plaintext could result in 
these systems being pulled into compliance scope.

While you have the freedom to author your Reactor Formula in any way you wish, we recommend that you strive to keep 
all sensitive data isolated within Basis Theory's secure and compliant infrastructure.
We generally recommend that any potentially sensitive output be tokenized in order to shield your systems.

### Importing Dependencies

You are able to import dependencies within Reactor Formulas. 
For example, `node-fetch` can be imported into your code and used to make an HTTP request:

```js
module.exports = async function (req) {
  const { card_number } = req.args;
  const { API_KEY } = req.configuration;
  const fetch = require('node-fetch');

  const res = await fetch(`https://api.company.com/`, {
    headers: { 
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ cardNumber: card_number })
  });
    
  return { ... };
};
```

In order to ensure the security and integrity of the Reactor execution environment, only approved NPM packages can be used within Reactor Formulas.
If you are interested in using a specific NPM package within your custom code, please 
[submit a request](https://support.basistheory.com/hc/requests/new?tf_subject=Request%20NPM%20Package%20for%20Private%20Reactor%20Formulas&amp;tf_description=Let%20us%20know%20what%20package%20you'd%20like%20to%20use&amp;tf_priority=normal) 
to have this package reviewed and whitelisted. 

### Error Handling

Many third party APIs or SDKs return errors in unique ways, so Reactor Formulas are expected to catch and handle any errors that occur during execution. 
Any errors that occur during the execution of your Reactor Formula should be caught, translated into a standard Basis Theory [Reactor error](https://github.com/Basis-Theory/basistheory-reactor-formulas-sdk-js/tree/master/src/errors),
and this standardized error rethrown from the formula.

The standard Basis Theory [Reactor errors](https://github.com/Basis-Theory/basistheory-reactor-formulas-sdk-js/tree/master/src/errors) 
are defined within the NPM package [@basis-theory/basistheory-reactor-formulas-sdk-js](https://www.npmjs.com/package/@basis-theory/basis-theory-reactor-formulas-sdk-js),
which is available to import from within your Reactor Formulas.
These standard error types will be translated by the Reactor execution environment into [HTTP errors](https://docs.basistheory.com/#errors-reactor-errors)
returned from the Basis Theory API. Any other uncaught exceptions thrown from a Reactor Formula will be returned as a generic HTTP `500` error 
and the original error message will be lost. The Reactor Formula will be retried up to 3 times in the event of any transient errors (an HTTP status code `>=500` or `408 Request Timeout`).

As an example, if you are working with an API that returns errors indicated by HTTP response status codes, 
your formula can translate from these potentially vendor-specific status codes to a standard Basis Theory error as follows: 

```js
module.exports = async function (req) {
  const {
    AuthenticationError,
    BadRequestError,
    ReactorRuntimeError,
  } = require('@basis-theory/basis-theory-reactor-formulas-sdk-js');
  const fetch = require('node-fetch');
  
  const res = await fetch(...);
  const response = await res.json();

  if (res.status !== 200) {
    switch (res.status) {
      case 401:
        throw new AuthenticationError(response);
      case 400:
        throw new BadRequestError(response);
      default:
        throw new ReactorRuntimeError(response);
    }
  }
  
  // ...
};
```

Any object or array passed into the constructor of a standard Basis Theory Reactor error will be returned in the `errors` 
property of the HTTP response when invoking the Reactor. Use caution when returning data through `errors`, 
as it will be returned in plaintext and not be tokenized or masked.

## Creating a Private Reactor Formula

As an example, we will be creating a custom Reactor Formula that interacts with the [Lithic API](https://docs.lithic.com/docs/cards#create-card) 
to issue a credit card from our hypothetical company's corporate Lithic account.

We will allow setting a single configuration parameter with this Reactor, the API key issued by Lithic for our account:

| Name           | Type    | Description                   |
|:---------------|:--------|:------------------------------|
| LITHIC_API_KEY | string  | The api key issued by Lithic  |

We will also allow requests to our Reactor to specify several parameters that we will forward to the Lithic API to 
control the name of our new card, the type of card to create, and the spend limit of the card:

| Name                 | Type   | Description                                                                                                            |
|:---------------------|:-------|:-----------------------------------------------------------------------------------------------------------------------|
| memo                 | string | The name to identify the card                                                                                          |
| type                 | string | The type of card to issue ([see Lithic docs](https://docs.lithic.com/docs/cards#cardtype))                             |
| spend_limit          | number | The amount (in cents) to limit approved authorizations                                                                 |
| spend_limit_duration | string | Duration for which spend limit applies ([see Lithic docs](https://docs.lithic.com/docs/cards#cardspend_limit_duration) |

We can then use these configuration and request parameters in our Reactor Formula code to make an API request to Lithic.
We will also create a `card` token as output from this Reactor using the card details provided to us in the Lithic API response. 

```js
module.exports = async function (req) {
  const { LITHIC_API_KEY } = req.configuration;
  const { memo, type, spend_limit, spend_limit_duration } = req.args;

  const fetch = require('node-fetch');

  const body = {
    memo,
    type,
    spend_limit,
    spend_limit_duration,
    state: 'OPEN'
  };

  const response = await fetch(
    `https://sandbox.lithic.com/v1/card`,
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 
        'Authorization': `api-key ${LITHIC_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  );
  // omitted for brevity: translate response status codes to Basis Theory Reactor errors
    
  const lithicCard = await response.json();

  return { 
    tokenize: {
      type: 'card',
      data: {
        number: lithicCard.pan,
        expiration_month: lithicCard.exp_month,
        expiration_year: lithicCard.exp_year,
        cvc: lithicCard.cvv
      },
      metadata: {
        lithic_token_id: lithicCard.token
      }
    }
  };
}
```

Next, we need to create a Private Reactor Formula in Basis Theory containing this `code`, `configuration`, and `request_parameters` by calling the 
[Create Reactor Formula](https://docs.basistheory.com/#reactor-formulas-create-reactor-formula) API. Note that all newline characters must be escaped as `\n` within the `code` property of the JSON request:

```bash
curl 'https://api.basistheory.com/reactor-formulas' \
  -X 'POST' \
  -H 'BT-API-KEY: key_PtkNaBwXe23rGt1eZenMMx' \
  -H 'Content-Type: application/json' \
  -d '{
      "name": "Lithic - Issue Card",
      "description": "Issues a new card using Lithic",
      "type": "private",
      "code": "module.exports = async function (req) {\n    const { LITHIC_API_KEY } = req.configuration;\n    const { memo, type, spend_limit, spend_limit_duration } = req.args;\n  \n    const fetch = require('node-fetch');\n  \n    const body = {\n      memo,\n      type,\n      spend_limit,\n      spend_limit_duration,\n      state: 'OPEN'\n    };\n  \n    const response = await fetch(\n      `https://sandbox.lithic.com/v1/card`,\n      {\n        method: 'post',\n        body: JSON.stringify(body),\n        headers: { \n          'Authorization': `api-key ${LITHIC_API_KEY}`,\n          'Content-Type': 'application/json',\n        }\n      }\n    );\n    const lithicCard = await response.json();\n  \n    return { \n      tokenize: {\n        type: 'card',\n        data: {\n          number: lithicCard.pan,\n          expiration_month: lithicCard.exp_month,\n          expiration_year: lithicCard.exp_year,\n          cvc: lithicCard.cvv\n        },\n        metadata: {\n          lithic_token_id: lithicCard.token\n        }\n      }\n    };\n  }\n",
      "configuration": [
          {
              "name": "LITHIC_API_KEY",
              "description": "The api key issued by Lithic",
              "type": "string"
          }
      ],
      "request_parameters": [
          {
              "name": "memo",
              "description": "The name to identify the card",
              "type": "string",
              "optional": false
          },
          {
              "name": "type",
              "description": "The type of card to issue",
              "type": "string",
              "optional": false
          },
          {
              "name": "spend_limit",
              "description": "The amount (in cents) to limit approved authorizations",
              "type": "number",
              "optional": true
          },
          {
              "name": "spend_limit_duration",
              "description": "Duration for which spend limit applies",
              "type": "string",
              "optional": true
          }
      ]
  }'
```

The API will respond with the `id` of our new Private Reactor Formula:

```json
{
  "id": "886f14ab-9404-444e-ae44-848c87d1ff88",
  "type": "private",
  "status": "verified",
  "name": "Lithic - Issue Card",
  "description": "Issues a new card using Lithic",
  ...
}
```

## Using Our Private Reactor Formula

Next, we will use this Reactor Formula to [create a Reactor](https://docs.basistheory.com/#reactors-create-reactor)
that contains the `LITHIC_API_KEY` to interact on behalf of our company's Lithic account:

```bash
curl 'https://api.basistheory.com/reactors' \
  -X 'POST' \
  -H 'BT-API-KEY: key_PtkNaBwXe23rGt1eZenMMx' \
  -H 'Content-Type: application/json' \
  -d '{
      "name": "Lithic - Issue Card from My Company",
      "configuration": {
        "LITHIC_API_KEY": "02f0a915-6226-4a8b-861e-58b08984106f"
      },
      "formula": {
        "id": "886f14ab-9404-444e-ae44-848c87d1ff88"
      }
  }'
```

The Basis Theory API will respond with the `id` of our new Reactor, which we will use later to invoke our Reactor:

```json
{
  "id": "ab8a1c9a-8666-449d-91c7-6c0d77bf7d02",
  "name": "Lithic - Issue Card from My Company",
  "configuration": {
    "LITHIC_API_KEY": "02f0a915-6226-4a8b-861e-58b08984106f"
  },
  "formula": {...},
  ...
}
```

Now that we have created a Reactor that uses our private formula, we can now make requests to it. 
We will use the [Invoke a Reactor](https://docs.basistheory.com/#reactors-invoke-a-reactor) endpoint with `args`
that instruct our Reactor to issue a card called `John's Travel Card` with a total spending limit of $500.

```bash
curl 'https://api.basistheory.com/reactors/ab8a1c9a-8666-449d-91c7-6c0d77bf7d02/react' \
  -X 'POST' \
  -H 'BT-API-KEY: key_PtkNaBwXe23rGt1eZenMMx' \
  -H 'Content-Type: application/json' \
  -d '{
      "args": {
        "memo": "John'\''s Travel Card",
        "type": "UNLOCKED",
        "spend_limit": 50000,
        "spend_limit_duration": "FOREVER"
      }
  }'
```

The Basis Theory API will respond with a newly created `card` token that contains the card details issued by Lithic.

```json
{
    "tokens": {
        "id": "27ca2332-826f-4064-935a-603bfc5d8fb0",
        "type": "card",
        "data": {
            "number": "XXXXXXXXXXXX8208",
            "expiration_month": 4,
            "expiration_year": 2028
        },
        "metadata": {
            "lithic_token_id": "de9fd4cf-fd5b-4ebc-8a25-3a564bc375c2"
        },
        ...
    }
}
```

## Wrapping Up

We've seen how to create Private Reactor Formulas to run your own code within Basis Theory's serverless Reactor infrastructure. 
By bringing your own code, you have the flexibility to use your token data however you need - 
the possibilities of what you can do with Reactors are virtually unlimited.

Remember that Private Reactor Formulas are not yet generally available, but if you are interested in getting started now, 
you can [request access](https://support.basistheory.com/hc/requests/new?tf_subject=Join%20Beta%20Program%20to%20Code%20Your%20Own%20Reactor&amp;tf_description=Let%20us%20know%20what%20you'd%20like%20to%20do%20with%20your%20Reactor&amp;tf_priority=normal) to the private beta!

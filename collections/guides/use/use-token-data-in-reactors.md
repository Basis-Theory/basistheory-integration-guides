---
layout: default
title: Use Token Data in Reactors
permalink: /guides/use-token-data-in-reactors/
categories: guides
subcategory: use
nav_order: 3
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Use Token Data in Reactors
{: .no_toc }

In this guide, we will show you how to use the pre-built [Parrot BIN service](https://askparrot.com) Reactor Formula to 
take your tokenized card data and capture new analytical insights.

If you are completely new to Reactors and would like to learn more about what they are before trying them out,
check out our [Reactors](/concepts/what-are-reactors/) concept page.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Create a Reactor

Initially, we will show you how to create a Reactor from our portal, although you can also use the 
[Basis Theory API](https://docs.basistheory.com/#reactors) to replicate these steps within your own CI pipelines or code base.

Once you're logged into the Basis Theory Portal, navigate to our [Reactors](https://portal.basistheory.com/reactors) 
page and click on "Create Reactor" on the top right to begin creating a new Reactor. 
On this page, you'll see a listing of all available Reactor Formulas.

Selecting a Reactor Formula will slide out a view to explain that formula's requirements. 
The Configuration section allows you to configure API keys or environment variables that remain static across Reactor invocations, 
while the Request Parameters section will show you the arguments you must send to the `/react` endpoint each time it is invoked.

![Screenshot of selecting a Reactor Formula](/assets/images/setup_first_reactor/selecting-reactor-formula.png)

Once you find the Reactor Formula you want to create, select "Use this formula" to start creating a Reactor.  
Next, you'll be able to name and add any additional configuration to the Reactor.

![Screenshot of create a Reactor](/assets/images/setup_first_reactor/create-reactor.png)

That's it! Once you've saved your first Reactor, you can begin interacting with it via our API.

<span class="base-alert info">
  <span>
    As always, you can create the same results with the Basis Theory API to codify the <a href="https://docs.basistheory.com/api-reference/#reactors-create-reactor">creation of Reactors</a>.
  </span>
</span>

## Use Your New Reactor

With your Reactor created, it's time to start using your tokens in it. Depending on which Reactor Formula you chose to create a Reactor from,
you'll need to pass in the corresponding request parameters it needs. The Parrot Reactor Formula requires only a single parameter:

| name                    | type     | optional |
|:------------------------|:---------|:---------|
| `card.number`           | *string* | false    |

Request parameters are provided when [invoking a Reactor](https://docs.basistheory.com/#reactors-invoke-a-reactor) via the `args` request property.
In order to satisfy the request parameter contract defined on the Reactor Formula, you may supply any mixture of constant values
and [detokenization expressions](https://docs.basistheory.com/detokenization#detokenization-expressions) within `args`.

Next, we'll walk through a couple ways in which you could invoke the Parrot reactor to provide the card number depending on how you chose to tokenize your card data.

<span class="base-alert warning">
    <span>
    To run a Reactor, an application needs `token:<classification>:use:reactor` permission for any tokens that are detokenized. 
    For these examples you will need an application with `token:pci:use:reactor` permission. <a href="https://portal.basistheory.com/applications/create?permissions=token%3Apci%3Ause%3Areactor&type=server_to_server&name=Card+Reactor" target="_blank">Click here to create one.</a>
    </span>
</span>

In each of the following examples, on a successful request you will be returned a [React Response](https://docs.basistheory.com/#reactors-invoke-a-reactor) which contains data returned from your executed Reactor.

```js
{
    "tokens": "<Tokenized Data Returned from the Reactor>",
    "raw": "<Raw Output Returned from the Reactor>"
}
```

### Use a Card Number Token

In the following example we have opted to store the card number within a [Card Number Token](https://docs.basistheory.com/api-reference/#token-types-card-number).
We will include a [detokenization expression](https://docs.basistheory.com/detokenization#detokenization-expressions) containing this token in the Reactor request,
which will result in the original token data being inserted within the request sent to the Reactor.

```js
curl "https://api.basistheory.com/reactors/<reactor_id>/react" \
  -H "BT-API-KEY: <application_api_key>" \
  -X "POST" \
  -d '{
    "args": {
      "card": {
        "number": "{%raw%}{{<card_number_token_id>}}{%endraw%}"
      } 
    }
  }'
```

### Use a Card Token

In the following example we have opted to store the card data within a [Card Token](https://docs.basistheory.com/#token-types-card).
Since the data within a Card token contains a `number` property, we can simply detokenize the entire Card token
into the `card` argument, which will cause the token's entire JSON object data to be inserted into the `card` node.

```js
curl "https://api.basistheory.com/reactors/<reactor_id>/react" \
  -H "BT-API-KEY: <application_api_key>" \
  -X "POST" \
  -d '{
    "args": {
      "card": "{%raw%}{{<card_token_id>}}{%endraw%}"
    }
  }'
```

Since Reactors validate the provided `args` against the declared request parameters and drop any undeclared arguments,
the additional properties (`expiration_month`, `expiration_year`, `cvc`) on the Card token object will be automatically removed from the request.

### Use a Card Token with a JSON Path Transformation

In the following example we have again opted to store the card data within a [Card Token](https://docs.basistheory.com/#token-types-card).
However, in this example we will pass only the `number` property from the Card token by using a [JSON Path Transformation](https://docs.basistheory.com/detokenization#transformations-json-path)
to project out the `number` property.

```js
curl "https://api.basistheory.com/reactors/<reactor_id>/react" \
  -H "BT-API-KEY: <application_api_key>" \
  -X "POST" \
  -d '{
    "args": {
      "card": {
        "number": "{%raw%}{{ <card_token_id> | $.number }}{%endraw%}"
      }
    }
  }'
```

---
layout: default
title: Setup your first Reactor
permalink: /guides/setup-your-first-reactor/
categories: guides
subcategory: processing
nav_order: 2
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Set up your first Reactor
{: .no_toc }

Reactors are foundational to your ability to make your data more usable within your application. Instead of accessing sensitive data within your own system and executing your own queries and procedures on that data, our Reactor platform allows code to be executed against your data without the data ever leaving our secure and compliant environment. Reactors grant you the freedom to choose how you want to enrich and process your data without needing to worry about security or compliance.

In this guide, we will show you how to use the pre-built [Parrot BIN service](https://askparrot.com) Reactor Formula to take your Atomic Cards and capture new analytical data about them in 3 short steps.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Create a Reactor

Initially, we will show you how to create a Reactor from our portal, although you can also use the [Basis Theory API](https://docs.basistheory.com/#reactors) to replicate these steps within your own CI pipelines or code base.

Once you're logged into the Basis Theory Portal, navigate to our [Reactors](https://portal.basistheory.com/reactors) page and click on "Create Reactor" on the top right to begin creating a new Reactor. On this page, you'll see a listing of all available Reactor Formulas.

Selecting a Reactor Formula will slide out a view to explain the details and requirements for setting one up. The Configuration section includes `api_keys` or `environment_variables` you need to configure when first creating your Reactor, while the Request Parameter section will show you the options you can send to the `/react` endpoint to be used when enriching your token.

![Screenshot of selecting a Reactor Formula](/assets/images/setup_first_reactor/token-reactor-formula.png)

Once you find the Reactor Formula you want to create, select "Use this formula" to start creating a Reactor.  Next, you'll be able to name and add any additional configuration to the Reactor.

![Screenshot of create a Reactor](/assets/images/setup_first_reactor/create-reactor.png)

That's it! Once you've saved your first Reactor, you can begin interacting with it via our API.

<span class="base-alert info">
  <span>
    As always, you can create the same results with the Basis Theory API to codify the <a href="https://docs.basistheory.com/api-reference/#reactors-create-reactor">creation of Reactors</a>.
  </span>
</span>

## Use Your New Reactor

With your Reactor created, it's time to start sending your tokens into it and generate your first reaction. Depending on which Reactor you chose to create, you'll need to create the correct corresponding token type (for example the "Parrot" reactor is for [Atomic Cards](https://docs.basistheory.com/api-reference/#atomic-cards)).

Now that you have a token, we can use the [/react](https://docs.basistheory.com/api-reference/#atomic-cards-react-with-an-atomic-card) endpoint to send the token to your new Reactor.

The following example is for an [Atomic Card](https://docs.basistheory.com/api-reference/#atomic-cards). If your Reactor takes a different token type, you'll want to use that token base URL.

<span class="base-alert warning">
  <span>
    To run a Reactor, an application needs `token:<classification>:use:reactor` permission. For this example you will need `token:pci:use:reactor`. <a href="https://portal.basistheory.com/applications/create?permissions=token%3Apci%3Ause%3Areactor&type=server_to_server&name=Card+Reactor" target="_blank">Click here to create one.</a>
  </span>
</span>

```js
curl "https://api.basistheory.com/atomic/cards/<atomic_card_id>/react" \
  -H "BT-API-KEY: <application_api_key>" \
  -X "POST" \
  -d '{
    "reactor_id": "<reactor_id>"
  }'
```

On a successful call, you will be returned a [React Response](https://docs.basistheory.com/api-reference/#atomic-cards-react-with-an-atomic-card-react-response-object) which contains data from your executed Reactor.

```js
{
    "tokens": "<Tokenized Data Returned from the Reactor>",
    "raw": "<Raw Output Returned from the Reactor>"
}
```

<span class="base-alert info">
  <span>
    Want to create your own Formulas? Support for Custom Formulas is currently in private beta. [Join our Discord to learn more](https://discord.gg/NSvXxaW5Fv).
  </span>
</span>

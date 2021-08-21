---
layout: default
title: Setup your first Reactor
permalink: /guides/setup-your-first-reactor/
categories: guides
nav_order: 2
has_children: true
has_toc: false
---
# Setup your first Reactor
{: .no_toc }

Reactors are foundational to your ability to make your data more usable within your application. Instead of having the data in your own system running queries and procedures, our Reactor platform allows code to be run against your data, enabling you the freedom to choose how you want to enrich and process your data in a secure and compliant environment.


In this guide, we will show you how to use the pre-built [Parrot BIN service](https://askparrot.com) Reactor Formula to take your Atomic Cards and capture new analytical data about them in 3 short steps. After the first time it's simple to add additional reactors.


### Table of contents
{: .no_toc .text-delta }

1. Get Started
{:toc}


## 1.  Create a Reactor

Initially, we will show you how to create a Reactor from our portal, although you can also use the [Basis Theory API](https://docs.basistheory.com/#reactors) to replicate these steps with your CI pipelines or code base.


Once you're logged into the Basis Theory Portal, navigate to our Token Reactors page and click on "Create Reactor" on the top right to begin creating a new Token Reactor. On this page, you'll see a listing of all available Reactor Formulas.

Selecting a Reactor Formula will slide out a view to explain the details and requirements for setting one up. The Configuration section includes `api_keys` or `environment_variables` you need to configure when first creating your Reactor, while the Request Parameter section will show you the options you can send to the `/react` endpoint along with your token at the time of the request.

<img src="/assets/images/setup_first_reactor/token-reactor-formula.png">

Once you find the Reactor formula you want to create, select "Use this formula" to start creating a Reactor.  Next, you'll be able to name and add any additional configuration to the Reactor.

<img src="/assets/images/setup_first_reactor/create-reactor.png">

Thats it! Once you've saved your first Token Reactor, you can begin interacting with it via our API.

<span class="base-alert success">
  <span>
    As always, you can create the same results with our Management API to codify the creation of Token Reactors.
  </span>
</span>

## 3.  Create a reaction with your new Reactor

With your Token Reactor created, it's time to start sending your tokens into it and generate your first reaction. Depending on which Reactor you chose to create, you'll need to create the correct corresponding token type (for example the "Parrot" reactor is for [Atomic Cards](https://docs.basistheory.com/api-reference/#atomic-cards)).

Now that you have a token, we can use the [/react](https://docs.basistheory.com/api-reference/#create-an-atomic-card-reaction) endpoint to send the token to your new Token Reactor!

The following example is for an [Atomic Card](https://docs.basistheory.com/api-reference/#atomic-cards). If your Reactor takes a different token type, you'll want to use that token base URL.

<span class="base-alert warning">
  <span>
    To create a reaction, an application needs `<source_token_type>:read`, `<source_token_type>:create`, and `reactor:read` permissions
  </span>
</span>

```js
curl "api.basistheory.com/atomic/cards/<atomic_card_id>/react" \
  -H "X-API-KEY: <application_api_key>" \
  -X "POST" \
  -d '{
    "reactor_id": "<reactor_id>",
  }'
```

On a successful call, you will be returned the newly generated Token including the returned data from your executed Reactor.

```js
{
    "id": "66bcf7cf-7846-432c-8637-9e849bcc053b",
    "tenant_id": "4cd722ab-55ea-41e1-a2c8-47c6d3843186",
    "type": "card:reaction",
		"data": "<Response from Reactor>"
    "metadata": {
        "reactor_id": "b2423757-bf5c-4044-9e5b-dc4b01fbc772",
        "reactor_name": "Sample Reactor"
    },
    "created_by": "597f8bdc-6266-4a03-b26d-faf83fdbc2f8",
    "created_at": "2021-07-30T11:43:05.758308+00:00"
}
```

## 3.  Retrieve your newly created reaction

Now that you have successfully created your first token reaction, you can always request that token back by using the [/reactions](https://docs.basistheory.com/api-reference/?shell#get-an-atomic-card-reaction-token) endpoint on your token.

```js
curl "api.basistheory.com/atomic/cards/<atomic_card_id>/reaction/<reaction_token_id>" \
  -H "X-API-KEY: <application_api_key>" \
  -X "GET"
```

<span class="base-alert success">
  <span>
    Want to create your own Formulas? We are currently in private beta with our Custom Formula, [join our Discord to learn more](https://discord.gg/XjWsy8PqK2).
  </span>
</span>

---
layout: default
title: Collect and Charge Credit Cards with JavaScript
permalink: /guides/collect-cards-with-elements/
categories: guides
subcategory: use
nav_order: 1
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Collect and Charge Credit Cards with JavaScript
{: .no_toc }

Once you've completed this guide, you will have learned how any website or frontend application can use our Elements to collect, store, and use credit card information with the Basis Theory platform. You'll also have a foundational understanding of how you can use your credit card data with multiple third-parties as if you had a PCI Level 1 system and were able to store the data within your own database.

If you'd like to follow along with this guide from scratch, we suggest creating a new Vanilla JS sandbox using <a href="http://codesandbox.io/">codesandbox.io</a> and getting started from there! Want to jump right into our sample app? <a href="https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-elements">Find it here!</a>

Using React? Check out the [Collect Credit Cards with React Guide](/guides/collect-cards-with-elements-react/).

<span class="base-alert info">
  <span>
    This guide is for collecting cards using the single `CardElement`. In case you prefer to have the card number, expiration date and cvc each in separate elements, check the docs on how to use them <a href="https://docs.basistheory.com/elements/#introduction">here</a> or check out our sample app <a href="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-individual-elements-js?module=/public/index.html,/public/index.js,/api.js">here</a>.
  </span>
</span>

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Add Elements to your website

<span class="base-alert warning">
  <span>
    To start, you'll need a new <code>Public</code> [Application](https://docs.basistheory.com/api-reference/#applications) with the <code>token:pci:create</code> permission. <a href="https://portal.basistheory.com/applications/create?permissions=token%3Apci%3Acreate&type=public&name=Card+Collector" target="_blank">Click here to create one.</a>
  </span>
</span>

Using our hosted elements, you can collect cards on any webpage you need to, while maintaining the lowest possible PCI compliance level.

```html
<html>
  <head>
    <script src="https://js.basistheory.com"></script>
    <script>
      let card;
      async function submitCard() {    
        const cardToken = await BasisTheory.tokens.create({
          type: 'card',
          data: card
        });
        console.log(cardToken);
      }

      window.addEventListener("load", async () => {
        await BasisTheory.init(<ELEMENTS_API_KEY>, {
          elements: true
        });

        card = BasisTheory.createElement("card", style);

        await card.mount("#card");

        card.on("change", (e) => {
          const button = document.getElementById("submit_button");
          button.disabled = !e.complete;
        });
      });
    </script>
  </head>
  <body>
    <div class="container">
      <div id="form">
        <div class="row" id="card"></div>
        <button id="submit_button" type="button" onclick="submitCard()">
          Submit
        </button>
      </div>
    </div>
  </body>
</html>
```

## Setup and Use a Token Reactor

Configure one of our pre-built Reactor Formulas, enabling you to quickly exchange raw card data for a processor token (e.g. Stripe).

To set up a Reactor, head over to our Portal and set up a new Stripe Reactor. If you're looking for step-by-step guide on how to set up a Reactor, head over to our [guide](/guides/setup-your-first-reactor).

## Using your new Reactor 
<span class="base-alert warning">
  <span>
    To use your Stripe Reactor, you'll need a <code>private</code> application with the following permissions <code>token:pci:read:low</code>, <code>token:pci:create</code> and <code>token:pci:use:reactor</code>. <a href="https://portal.basistheory.com/applications/create?type=private&permissions=token%3Apci%3Aread%3Alow&permissions=token%3Apci%3Acreate&permissions=token%3Apci%3Ause%3Areactor&name=Card+Reactor" target="_blank">Click here to create one.</a>
  </span>
</span>

Once you’ve created your Stripe Reactor, use the <code>reactor_id</code> and your Card token's ID to exchange for a Stripe token, which you'll be able to use to charge your customer. 

```js
const reactorResponse = await bt.reactors.react(REACTOR_ID, {
  args: {
    card: `{%raw%}{{${cardToken.id}}}{%endraw%}`
  }
});

return reactorResponse.raw.id;
```

Now that you have your Stripe Payment Method, you can store this within your own platform and avoid becoming dependent on Basis Theory for your future transactions. As soon as you need a new Stripe Payment Method, just call the `/react` endpoint for that reactor with your card token id, and you'll have a newly attached token.

## Use the reaction data to charge a customer

Now, you’re able to access the token created by your Reactor. You may be using this for analytical BIN information, fraud analytics, or to charge a card using the processor token you’ve created.


```js
const stripe = require("stripe")(STRIPE_API_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1099,
  currency: "usd",
  payment_method: paymentMethodId, // Payment Method from Stripe Reaction in step 2
  confirm: true
});

return paymentIntent;
```

## Use the raw card data whenever you need

With Basis Theory, we enable the highest level of usability for your card data possible. 
Is your primary processor down?  `react` with a back-up processor. 
Soft decline and want to reprocess?  `react` with another processor. 
Want to understand your customers card analytics?  `react` with a BIN List like Parrot.

Anything is possible when you store your card data with us. To expand your possibilities, just configure a new Reactor.

## See it in action
{: .no_toc }

See a sample and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-elements)
`
<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-elements-js?fontsize=14&hidenavigation=1&theme=dark&module=/public/index.html,/public/index.js,/api.js" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>
`
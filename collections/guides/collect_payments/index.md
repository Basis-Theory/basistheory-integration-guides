---
layout: default
title: Collect Atomic Cards with Elements
permalink: /guides/collect-atomic-cards-with-elements/
categories: guides
nav_order: 3
has_children: true
has_toc: false
---
# Collect payments with Elements
{: .no_toc }

Retain control of your card data while enabling your business to use any current or new processing relationships as you extend your business's product lines, look to increase auth rates, or reduce your overall cost of payments.  No matter why you're here, we will always enable you to use the data how you want to use it. Even if that means exporting the data out of Basis Theory.

Basis Theory is here to make sure you can keep the lowest level of PCI compliance while retaining your ability to use your card data whenever and however you need to. We enable you to capture cards via form elements, exchange or forward that data to any other approved vendor or processor, and continue to grow and extend your business into its next growth cycle!

If you'd like to follow along with this guide from scratch, we suggest creating Vanilla JS sandbox using <a href="http://codesandbox.io/">codesandbox.io</a> and getting started from there! Want to jump right into our sample app? <a href="https://codesandbox.io/s/example-charging-card-o2qss?file=/public/index.html">Find it here!</a>

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Add Elements to your website

<span class="base-alert warning">
  <span>
    To start, you'll need a new Elements Application with the <code>card:create</code> permission
  </span>
</span>

Using our hosted elements, you can collect cards on any webpage you need to, while maintaining the lowest possible PCI compliance level.

```html
<html>
  <head>
    <script src="https://js.basistheory.com"></script>
    <script>
      var card;
      async function submitCard() {
        const name = document.getElementById("name").value;
        const token = await BasisTheory.elements.storeCreditCard({
          card,
          billingDetails: {
            name
          }
        });
        console.log(token);
      }

      window.addEventListener("load", async () => {
        await BasisTheory.init("<ELEMENTS APPLICATION ID>", {
          elements: true,
          environment: "sandbox"
        });
        card = BasisTheory.elements.create("card");
        await card.mount("#card");
      });
    </script>
  </head>
  <body>
    <div class="container">
      <div id="form">
        <div class="row">
          <label for="name">Name</label>
          <input id="name" placeholder="Jane Doe" />
        </div>
        <div class="row temp" id="card"></div>
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

To set up a Reactor, head over to our Portal and set up a new Stripe reactor. If you're looking for step-by-step guide on how to set up a token Reactor, head over to our [guide](/guides/setup-your-first-reactor).


## Using your new Reactor 
<span class="base-alert warning">
  <span>
    To use your Stripe Reactor, you'll need a <code>server-to-server</code> application with the following permissions <code>card:read</code>, <code>card:create</code>, and <code>reactor:read</code>.
  </span>
</span>

Once you’ve created your Stripe Reactor, use the <code>reactor_id</code> and your Atomic Card token's ID to exchange for a Stripe token, which you'll be able to use to charge your customer.

```js
const response = await fetch(`https://api.basistheory.com/atomic/cards/${id}/react`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": SERVER_KEY
  },
  body: JSON.stringify({
    reactor_id: REACTOR_ID,
    metadata: {}
  })
});

return (await response.json());
```

Now that you have your Stripe Payment Method, you can store this within your own platform and avoid becoming dependent on Basis Theory for your future transactions. As soon as you need a new Stripe Payment Method, just call the `/react` endpoint for that card, and you'll have a newly attached token.

## Use the reaction data to charge a customer

Now, you’re able to access the token created by your token reactor. You may be using this for analytical BIN information, fraud analytics, or to charge a card using the processor token you’ve created.

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

See a sample and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/example-charging-card-o2qss)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/example-charging-card-o2qss?fontsize=14&hidenavigation=1&theme=dark" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

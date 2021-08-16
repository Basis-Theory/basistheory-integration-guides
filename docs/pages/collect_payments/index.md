---
layout: default
title: Collect payments with Elements
permalink: /collect_payments_with_elements/
nav_order: 3
has_children: true
has_toc: false
---
# Collect payments with Elements
{: .no_toc }

##### Retain control of your card data  while enabling your business to use any current or new processing relationships as you extend your business's product lines, want to increase auth rates, or reduce your overall cost of payments.  No matter why you're here, we will always enable you to use the data how you want to use it even if that means exporting the data out of Basis Theory.
{: .no_toc }

Basis Theory is here to make sure you can keep the lowest level of PCI compliance while retaining your ability to use your card data whenever and however you need to use it. We enable you to capture cards via form elements, exchange or forward that data to any other approved vendor or processor, and continue to grow and extend your business into its next growth cycle!
{: .no_toc }

If you'd like to follow along with this guide from scratch, we suggest creating Vanilla JS <a href="http://codesandbox.io/">codesandbox.io</a> sandbox and getting started from there! Want to jump right into our sample app? <a href="https://codesandbox.io/s/example-charging-card-o2qss?file=/public/index.html">Find it here!</a>

### Table of contents
{: .no_toc .text-delta }

1. Add Elements to your website
{:toc}


## Add Elements to your website

To start, you'll need a new Elements Application with the `card:create` permission

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

Configure one of our pre-built reactor-formulas, enabling you to quickly exchange raw card data for a processor tokens(e.g. Stripe).

To setup a Reactor, head over to our Portal and setup a new Stripe reactor. If you're looking for step by step guide on how to setup a token reactor, head over to our guide.

2.1 Using your new Reactor 
To use your Stripe Reactor, you'll need a `server-to-server` application with the following permissions `card:read`, `card:create`, and `reactor:read` permissions

Once you’ve created your Stripe Reactor, use the reactor_id and your Atomic Card token's id to exchange for a Stripe token, which you'll be able to use to charge your customer.

```js
const response = await fetch(
    `https://api.basistheory.com/atomic/cards/${id}/react`,
    {
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
    }
  );

  return (await response.json());
```

Now that you have your Stripe Payment Method, you can store this within your own platform and avoid becoming dependent on Basis Theory for your future transactions. As soon as you need a new Stripe Payment Method, just call the `/react` endpoint for that card and you'll have a newly attached token.

## Use the reaction data to charge a customer

Now, you’re able to access the token created by your token exchange. You may be using this for analytical BIN information, fraud analytics, or to charge a card using the processor token you’ve created.

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

## Use the raw card data whenever you need.

With Basis Theory, we enable the highest level of usability for your card data possible. 
Is your primary processor down?  `react` with a back up processor. 
Soft decline and want to reprocess?  `react` with another processor. 
Want to understand your customers card analytics?  `react` with a BIN List like Parrot.

Anything is possible with your card data stored with us, just configure a new Reactor and expand your possibilities.

### See it in action:
{: .no_toc }

See a sample and the code that drives it below, want to experience the sandbox yourself? <a href="https://codesandbox.io/s/example-charging-card-o2qss">Check it out here.</a>
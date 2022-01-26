---
layout: default
title: Use U.S. Bank Accounts without touching them
permalink: /guides/use-us-bank-accounts-without-touching-them/
categories: guides
nav_order: 5
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Use U.S. Bank Accounts without touching them
{: .no_toc }

<span class="base-alert success">
  <span>
    This guide will quickly enable you to be compliant with new Nacha Encryption rules. 
  </span>
</span>

Safely storing bank account data in a way that enables your entire organization to safely use, is no small feat. It takes a strong encryption pattern, including a KMS, key rotation, multiple encryption keys, access controls, and so much more. 

In this guide, we will show you how to quickly collect and secure your customers' U.S. Bank Account information with Basis Theory. You'll learn how to collect the data using our Elements, toknize the information, and use our Serverless Reactor platform to communicate with Spreedly to obtain a Payment Method. 

If you'd like to follow along with this guide jump right into our sample app - <a href="https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-atomic-banks-with-elements?from-embed=&file=/public/index.html">Find it here!</a>

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Add Elements to your website

<span class="base-alert warning">
  <span>
    To start, you'll need a new Elements Application with the <code>token:bank:create</code> permission
  </span>
</span>

First, add two new `div` tag elements to your HTML. These will serve as a place to attach two separate Element tags for both Routing Number and Bank Account.

```html
    <div class="row row-input" id="routing_number"></div>
    <div class="row row-input" id="account_number"></div>
```

Second, you'll need to add the following javascript code to your application to mount each element:

```js 
  await BasisTheory.init(ELEMENTS_KEY, {
    elements: true,
  });

  let routingNumber = BasisTheory.createElement('text', {

    ...options,
    targetId: 'routingNumber',
    placeholder: 'Routing Number',
    'aria-label': 'Routing Number',
  });
  let accountNumber = BasisTheory.createElement('text', {

    ...options,
    targetId: 'accountNumber',
    placeholder: 'Account Number',
    'aria-label': 'Account Number',
  });

  await routingNumber.mount('#routing_number');
  await accountNumber.mount('#account_number');
```

Finally, you'll see two new Elements appear on your page. Next, we will tokenize the data entered into them!

## Create an Atomic Bank from your new Elements
Creating tokens with our Elements is as easy as if you're passing raw text. 


To create an [Atomic Bank](https://docs.basistheory.com/api-reference/#atomic-banks), you'll just need to pass the Element references from Step 1 into the `atomicBank.create` method.

```js
const token = await BasisTheory.atomicBanks.create({

      bank: {
        routingNumber,
        accountNumber,
      },
    });
```

You now have a new Atomic Bank assigned to `token` - typically the `id` and `mask` of this token is stored within your database which allows you to read back the data at a later date.


## Set up a Spreedly Reactor

Configure one of our pre-built Reactor Formulas, enabling you to quickly exchange raw bank data for a processor token (e.g. Spreedly - Bank).


To set up a Reactor, head over to our Portal and set up a new Spreedly Reactor. If you're looking for step-by-step guide on how to set up a Reactor, head over to our [guide](/guides/setup-your-first-reactor).


## Using your new Reactor 
<span class="base-alert warning">
  <span>
    To use your new Spreedly Reactor, you'll need a <code>server-to-server</code> application with the following permissions <code>token:bank:use:reactor</code> and <code>token:bank:create</code>.
  </span>
</span>

Once you’ve created your Spreedly Reactor, use the <code>reactor_id</code> and your Atomic Bank's ID to exchange for a new Spreedly Payment Method token, enabling you to charge your customer.

```js
const reactionToken = await bt.atomicBanks.react(token.id, {
    reactorId: REACTOR_ID
});

return reactionResult;

```

With your Spreedly Payment Method in hand, you can store this within your own platform and avoid becoming dependent on Basis Theory for your future transactions. As soon as you need a new Payment Method, just call the `/react` endpoint for that bank, and you'll have a newly attached token.


## Wrap up

Now that you understand the basics of using our Elements and Atomic Banks to collect and charge a customer, you have the ability to easily use your encrypted Atomic Bank in any way you'd like:

- Use our Serverless Reactors to create an ACH file (if you're looking to do this, [reach out!](https://basistheory.com/contact))
- Quickly begin securing and using raw bank data yourself with our API
- Interact with any other banking service you can imagine (e.g. Dwolla, Plaid, etc)
- [Style our Elements to look exactly like your own application](/guides/style-elements-for-my-brand/)


## See it in action
{: .no_toc }

Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-atomic-banks-with-elements?from-embed)


<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-atomic-banks-with-elements?fontsize=14&hidenavigation=1&theme=dark" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>

</div>
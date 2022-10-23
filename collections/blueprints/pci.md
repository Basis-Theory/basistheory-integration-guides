---
layout: post
title:  PCI Blueprint
categories: blueprints
permalink: /blueprints/pci/
nav_order: 1
has_children: true
has_toc: false
image:
  path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
  width: 1200
  height: 630
---

# PCI Blueprint
{: .no_toc }

Payment Card Industry Data Security Standard (PCI DSS) is a set of compliance requirements that must be met to collect, store, and process cardholder data. To fully implement these requirements is both costly and time intensive.

The Basis Theory PCI Blueprint will provide you with a guide to meet ***95% of the compliance requirements*** of PCI in as little as ***5 minutes***.

This blueprint assumes you are using a [React](https://reactjs.org/) frontend and [Node.js](https://nodejs.org/en/) API. The blueprint can be modified for your specific framework or language by leveraging our [Vanilla JS implementation](https://docs.basistheory.com/elements/#initialize) or one of our many language-specific SDKs.

<span class="base-alert info">
  <span>
    Don't want to complete this guide? View the completed example application <a href="https://github.com/Basis-Theory-Labs/pci-blueprint-example/">here</a>.
  </span>
</span>

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Collect Credit Cards

The first step to reducing your PCI scope is to securely collect cardholder information without your application touching the data. To do this, we will leverage [Basis Theory Elements](https://docs.basistheory.com/elements/). These secure form inputs for your web or mobile application collect sensitive cardholder data without directly interacting with the values.

### Install Basis Theory Package

Install the Basis Theory React package within your application using your package manager:

```bash
npm install --save @basis-theory/basis-theory-react
# or
yarn add @basis-theory/basis-theory-react
```

### Create a Public Application

To securely collect cardholder data, you'll need a [Public Application](https://docs.basistheory.com/api-reference/#applications) using our PCI compliant template `Collect PCI Data`. [Click here to create one.](https://portal.basistheory.com/applications/create?application_template_id=db9148c1-a55f-4164-b830-a20ab6d720ae)

This will create a PCI-compliant application with the following [Access Controls](/concepts/access-controls/):
* Permissions: `token:create`, `token:update`
* Containers: `/pci/`
* Transform: `mask`

Copy the API Key to be used in the next step.

### Initialize Basis Theory Elements

Let's create a new Card Form component. In a terminal in the same directory as your `App` component, type:

```bash
touch card-form.js
```

In your editor, update your App component with the following code, replacing `PUBLIC_API_KEY` with the API Key from the previous step:

```jsx
import { 
  useBasisTheory,
  BasisTheoryProvider
} from '@basis-theory/basis-theory-react';
import { CardForm } from './card-form';

export default function App() {
  const { bt } = useBasisTheory('PUBLIC_API_KEY', { elements: true });

  return (
    <BasisTheoryProvider bt={bt}>
      <CardForm />
    </BasisTheoryProvider>
  );
}
```

Next, add the following code to your new Card Form component:

```jsx
import { 
  useBasisTheory
} from '@basis-theory/basis-theory-react';

export const CardForm = () => {
  const { bt } = useBasisTheory();

  const submit = async () => {};

  return (
    <form onSubmit={submit}>
      <button type="button" onClick={submit} >
        Submit
      </button>
    </form>
  );
}
```

This will initialize Basis Theory JS and add your new card form.

### Add Card Element

Now, we need to add a [`CardElement`](https://docs.basistheory.com/elements/#element-types-card-element) component to our form. This Element type renders a single line containing input fields to capture the card number, expiration date, and CVC.

Add the `CardElement` to our inputs:

```jsx
import { 
  useBasisTheory,
  CardElement
} from '@basis-theory/basis-theory-react';
```

And inside of our `<form>` tag, add the following code:

```jsx
<CardElement id="card" />
```

Your card component should now look like this:

```jsx
import { 
  useBasisTheory,
  CardElement
} from '@basis-theory/basis-theory-react';

export const CardForm = () => {
  const { bt } = useBasisTheory();

  const submit = async () => {};

  return (
    <form onSubmit={submit}>
      <CardElement id="card" />

      <button type="button" onClick={submit} >
        Submit
      </button>
    </form>
  );
}
```

You can fully customize the [look and feel](./guides/secure/../../../guides/secure/style-elements-for-my-brand.md) to match your existing site and even listen to common [events](https://docs.basistheory.com/elements/#element-events) on all Elements components.

## Store Cards

Now that we have securely captured the card information, we need to securely store the card. 

To do this, we will tokenize the data with Basis Theory. Basis Theory handles all of the secure encryption and storage of the cardholder data and returns a non-sensitive token identifier that can be stored in your database.

### Tokenize the Card

Inside of your `CardForm`, we will update the `submit` function to tokenize the card using the PCI-compliant [`card` Token Type](https://docs.basistheory.com/#token-types-card):

```jsx
const submit = async () => {
  // Tokenize card with Basis Theory
  const token = await bt.tokenize({
    type: 'card',
    data: bt.getElement('card'),
  });

  // Submit card token to our Next.js app's API
  // Example using Axios
  const { data } = await axios.post('/api/cards', { cardTokenId: token.id });
};
```

### What is Happening?

When a user submits their payment information, we will tokenize the underlying value of the [CardElement](https://docs.basistheory.com/elements/#cardelement). This will instruct Basis Theory Elements to submit this sensitive card data directly to [Basis Theory's Tokenize endpoint](https://docs.basistheory.com/#tokenize) and return the resulting token identifiers to our front end, all without our application having accessed the sensitive card data directly.

We are also creating a [`card` Token Type](https://docs.basistheory.com/#token-types-card). This is a PCI-compliant token type that will validate the card number using the [LUHN algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) and automatically expire the `cvc` property after one hour.

The resulting token ID is safe to pass between your systems and store in plaintext within your preferred database.

You can fully customize your card token, such as the alias, mask, and metadata by leveraging all of our [token capabilities](/concepts/what-are-tokens) using [Expressions](https://docs.basistheory.com/expressions/).

<span class="base-alert warning">
  <span>
    To not take on additional PCI scope, you cannot reveal more than the first six digits or last four digits of the card number via a combination of the alias and mask on your card token.
  </span>
</span>

## Process Cards

Now that we have our card token, we need to be able to send the cardholder data to a PCI-compliant payment service provider (PSP) such as Stripe or Braintree. 

In order to do this, we will send the data without touching the tokenized value. To accomplish this, we will use [Basis Theory's Proxy](/concepts/what-is-the-proxy/).

### Create a Private Application

First, you will need a [Private Application](https://docs.basistheory.com/api-reference/#applications) using our PCI-compliant template `Use PCI Tokens`. This application will be used to securely send cardholder data via the Basis Theory Proxy to the PSP of your choice. [Click here to create one.](https://portal.basistheory.com/applications/create?application_template_id=31efed55-035c-4b49-b1a1-609a728d91ce)

This will create a PCI-compliant application with the following [Access Controls](/concepts/access-controls/):
* Permissions: `token:use`
* Containers: `/pci/`
* Transform: `reveal`

Copy the API Key to be used in the next step.

### Send the Data to the Payment Service Provider

From our backend API, we will now be able to send the cardholder data associated with our token to a third-party PSP.

Add the following code to your API, replacing `PRIVATE_API_KEY` with the API Key from the previous step::

```jsx
const { data }  = await axios.post(
  'https://api.basistheory.com/proxy', 
  {
    card_number: `{%raw%}{{ ${cardTokenId} | json: '$.number' }}{%endraw%}`,
    exp_month: `{%raw%}{{ ${cardTokenId} | json: '$.expiration_month' | to_number }}{%endraw%}`,
    exp_year: `{%raw%}{{ ${cardTokenId} | json: '$.expiration_year' | to_number }}{%endraw%}`,
    cvc: `{%raw%}{{ ${cardTokenId} | json: '$.cvc' }}{%endraw%}`
  }, 
  {
    headers: {
      'BT-API-KEY': 'PRIVATE_API_KEY',
      'BT-PROXY-URL': 'https://echo.basistheory.com/post',
      'Content-Type': 'application/json'
    }
  });
```

You should see a JSON response similar to:

```json
{
  "card_number": "4242424242424242",
  "exp_month": 12,
  "exp_year": 2025,
  "cvc": "123"
}
```

### What is Happening?
A secure HTTPS request is made to Basis Theory's Proxy endpoint. Basis Theory intercepts the request and detokenizes the [Expressions](https://docs.basistheory.com/expressions/) in the request body.

The detokenized request is then forwarded to the destination URL defined by the `BT-PROXY-URL` header passing request headers and query parameters along to the destination.

This allows you to send the sensitive PCI cardholder data to any PCI-compliant third-party without touching the data and, therefore, keeping your systems out of PCI scope.

<span class="base-alert warning">
  <span>
    You should ensure that any PCI cardholder data is only sent to PCI-certified third-parties. All PCI-certified services are required to maintain an up-to-date Attestation of Compliance (AOC) to accept and store cardholder information. 
  </span>
</span>

More advanced Proxy scenarios can be configured via the [Proxies endpoint](https://docs.basistheory.com/#proxies), such as tokenizing inbound cardholder data before it touches your API or encrypting outbound API calls with an encryption key.

## Conclusion
Following the PCI Blueprint enables you to remove 95% of the PCI compliance requirements by removing the need to touch the cardholder data when collecting, storing, and processing sensitive information. 

Have feedback or questions? Join us in our [Slack community](https://community.basistheory.com). 

---
layout: default
title: Reveal Card Data with React
permalink: /guides/reveal-cards-with-react/
categories: guides
subcategory: use
nav_order: 3
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Reveal Card Data with React

This following guide shows how you can safely reveal tokenized data to your users, without ever touching the detokenized data directly, therefore reducing your scope.  

It’s assumed on this guide that you are already familiar with the Basis Theory platform, but if that is not the case, please take a look at our getting started [guides](https://developers.basistheory.com/getting-started) before going further.

## Creating an Expiring Application

Token data can only be retrieved using Basis Theory Elements with an <a href="https://docs.basistheory.com/#applications-application-types">expiring</a> application. This restriction is in place because when retrieving token data with Elements, by nature, the API key is publicly exposed by the browser network calls.  
An `expiring` application has an expiration date, meaning that after a specified amount of time (up to 1 day), the application API key can no longer be used so the risk of having this API key publicly exposed is possibly mitigated. 

The following steps address how you can create an `expiring` application:

### Enable "Create Expiring Application" on a Private Application

Applications of the `expiring` type are created from `private` applications, instead of a `management` application like other application types. This is done so the `expiring` application permissions are initially inherited from the parent `private` application, but still with the possibility of scoping permissions further down during creation. 
The `private` application in question must either have the `token:read` <a href="https://developers.basistheory.com/concepts/access-controls/#permissions">permission</a> or an [access rule](https://developers.basistheory.com/concepts/access-controls/#what-are-access-rules) that has the permission in order for revealing token values to be possible. 
To enable a `private` application to create expiring applications, simply set the toggle in the Customer Portal, either during the `private` application creation or when updating an existing one: 

![Image of Create Expiring Application toggle in the portal](/assets/images/elements_reveal/enable_expiring_applications.png)

Additionally, you can also enable this through our [API or SDKs](https://docs.basistheory.com/#applications-create-application) using the `can_create_expiring_applications` flag. 

<span class="base-alert warning">
  <span>
    Tokens of type <code>card</code> are automatically added to the <code>/pci/high/</code> container.
    Your private application created/updated needs <code>read</code> access to this container to continue with this tutorial.
    If you don't have a private application yet that meets this criteria yet, you can <a href="https://portal.basistheory.com/applications/create?application_template_id=e6d4c554-6703-4bbb-b351-42cd2ee5cb5a">click here</a> to create one.
  </span>
</span>

### Create The Expiring Application

Now that the `private` application has the ability to create `expiring` applications, you can use the `private` application API key to create expiring applications from your server-side code.

The example below uses the Basis Theory JS SDK to accomplish this:

```jsx
import { BasisTheory } from '@basis-theory/basis-theory-js';

const bt = await new BasisTheory().init(process.env.BASIS_THEORY_PRIVATE_KEY);

const expiringApplication = await bt.applications.create({
  type: 'expiring',
  expires_at: ttl(),
  rules: [
    {
      description: 'Reveal Card',
      priority: 1,
      transform: 'reveal', // required for reveal
      container: '/pci/high/',
      conditions: [
        {
          attribute: 'id',
          operator: 'EQUALS',
          value: req.body?.tokenId, // from the request made to the server-side code
        },
      ],
      permissions: ['token:read'], // required for reveal
    },
  ],
});
```

## Using Expiring Application Keys to Reveal Card with Elements React

Now that you are already creating `expiring` applications and fetching the keys with your client side code, those keys can be used to safely retrieve tokens and set their values onto Elements for users to see. 

### Creating a CardElement with Basis Theory React

For this example, we are going to be using the [Basis Theory React](https://docs.basistheory.com/elements/#react-package) package to mount elements onto a React based frontend. 

The process of creating and mounting an Element is the same as [usual](https://developers.basistheory.com/guides/collect-cards-with-elements-react/). You still need a `public` application key for that.

```jsx
import { useRef } from 'react';
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';
import { CardElement as ICardElement } from '@basis-theory/basis-theory-js/types/elements';

export const DisplayCard = () => {
  const { bt } = useBasisTheory();
  const cardRef = useRef<ICardElement>(null);

  return (
    <CardElement id="myCard" ref={cardRef}/>
  );
};
```

### Using the Expiring Application Key to Retrieve a Token with Elements

Assuming your client code is already fetching `expiring` application keys as per previous steps, these can then be used to retrieve a token value, granted that proper permissions are applied. 
Any attribute from the token like `metadata` can be directly accessible from the response, <strong>except</strong> for `data`, which represents just a reference to the actual data value that can be used with `setValue` in the next step.

```jsx
const cardToken = await bt.tokens.retrieve(tokenId, { apiKey: expiringKey });
```

### Revealing Token Data with Elements

As said previously, the retrieved token `data` value does not contain the actual data but just a reference to it. The actual `data` is safely stored in a Basis Theory `iframe` and can be set as the value for an Element input internally using the `setValue` method:

```jsx
cardRef.current.setValue(cardToken.data)
```

### Putting it All Together

See the complete code we created in this tutorial below. 

```jsx
import { useRef } from 'react';
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';
import { CardElement as ICardElement } from '@basis-theory/basis-theory-js/types/elements';

export const DisplayCard = () => {
  const { bt } = useBasisTheory();
  const cardRef = useRef<ICardElement>(null);

  const revealCard = async () => {

    // fetching the expiring application key from your server side code
    const {
      data: { expiringKey },
    } = await axios.post('/api/authorize');

    // using the expiring application key to retrieve the token
    const cardToken = await bt.tokens.retrieve(tokenId, { apiKey: expiringKey });

    // setting the token data value into the CardElement
    cardRef.current.setValue(cardToken.data); 
  }

  const cardToken = await bt.tokens.retrieve(tokenId, { apiKey: expiringKey });

  return (
    <>
      <CardElement id="myCard" ref={cardRef}/>
      <button type="button" onClick={revealCard}>Reveal Card</button>
    </>
  );
};
```

That's it, now the token data can be displayed to the user 🎉, and since your client does not have direct access to the actual data value, it falls out of compliance scope.

## Demo Repository

To better demonstrate this feature, a demo [repository](https://github.com/Basis-Theory-Labs/display-card-example) that you can clone and run on your local machine has been made available.

The repository uses a few of the [Element's user experience](https://docs.basistheory.com/elements/#introduction) features to better enhance the usage experience and to make testing easier like:
- Adds a `CardElement` for collecting cards that will be subsequently revealed. 
- Using the split `CardNumberElement`, `CardExpirationDateElement` and `CardVerificationCodeElement` to create a UI that resembles a credit card visually when revealing values.
- Uses the `NextJS` server side API to fetch `expiring` application keys in real time. 
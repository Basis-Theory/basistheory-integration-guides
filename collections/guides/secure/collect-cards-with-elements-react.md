---
layout: default
title: Collect Credit Cards with React
permalink: /guides/collect-cards-with-elements-react/
categories: guides
subcategory: secure
nav_order: 3
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Collect Credit Cards with React

Once you've completed this guide, you will have learned how your React application can use our Elements to collect and store credit card information on the Basis Theory platform. This simple task enables you to retain control of your card data and enables the use of credit card data with any third party as if you had the data stored in your own database.

If you'd like to follow along with this guide from scratch, we suggest creating a new React sandbox using <a href="http://codesandbox.io/">codesandbox.io</a> and getting started from there! Want to jump right into our sample app? <a href="https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-elements-react">Find it here!</a>

<span class="base-alert info">
  <span>
    This guide is for collecting cards using the single `CardElement`. In case you prefer to have the card number, expiration date and cvc each in separate elements, check the docs on how to use them <a href="https://docs.basistheory.com/elements/#introduction">here</a> or check out our sample app <a href="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-individual-elements-react?module=/src/App.tsx,/src/CheckoutForm.tsx">here</a>.
  </span>
</span>

## Let's code

<span class="base-alert warning">
  <span>
    To start, you'll need a new <code>Public</code> [Application](https://docs.basistheory.com/api-reference/#applications) 
    with the <code>token:create</code> permission granted to the `/pci/` container.
    <a href="https://portal.basistheory.com/applications/create?application_template_id=db9148c1-a55f-4164-b830-a20ab6d720ae" target="_blank">Click here to create one.</a>
  </span>
</span>

Install our React package:

```bash
npm install --save @basis-theory/basis-theory-react
```

Initialize the Basis Theory SDK passing the API Key to the `useBasisTheory` hook and wrap your `App` contents with a `BasisTheoryProvider`:

```jsx
import {
    useBasisTheory,
    BasisTheoryProvider,
} from '@basis-theory/basis-theory-react';

function App() {
    const { bt } = useBasisTheory(ELEMENTS_API_KEY, {
        elements: true,
    });

    return (
        <BasisTheoryProvider bt={bt}>
            <!-- rest of app code goes here -->
        </BasisTheoryProvider>
    );
}
export default App;
```

Create a `CheckoutForm` component and add it inside the `BasisTheoryProvider` in your `App` content.

Create a `ref` that will be used to store the underlying elements instance.

Declare a `CardElement` inside it and call the tokenization method `tokens.create` passing the token's type (card) and the underlying card element instance:

```jsx
import { useRef } from 'react';
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';

export const CheckoutForm = () => {
  const { bt } = useBasisTheory();
  const cardRef = useRef(null);

  const submit = async () => {
    try {
      const token = await bt.tokens.create({
        type: 'card',
        data: cardRef.current,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
        <CardElement id="myCard" ref={cardRef}/>
        <button
          id="submit_button"
          type="button"
          onClick={submit}
        >
          Submit
        </button>
    </>
  );
};
```

Success! 🎉 Your React application is now collecting and storing credit cards in Basis Theory platform.

## Next steps

The Token you've created from your frontend application can be used in a variety of ways from within your system, check out a few of those below:
- You can fetch the card data later in your server, using a Private Application Key (<a href="https://portal.basistheory.com/applications/create?application_template_id=e6d4c554-6703-4bbb-b351-42cd2ee5cb5a" target="_blank">click here to create one</a>) to call [Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token);
- Call one of our [Reactors](https://docs.basistheory.com/api-reference/#reactors) to process that card data. [Here is how to charge a card with Node.js](/guides/collect-cards-with-elements/#setup-and-use-a-token-reactor);
- Make a third party API request with the raw data through our [Proxy](https://docs.basistheory.com/api-reference/#proxy). Feel free to [contact us](mailto:support@basistheory.com?subject=CardElement%20and%20Proxy%20usage) for more information on how to do it.

## See it in action

The example below uses a few of the [Element's user experience](https://docs.basistheory.com/elements/#introduction) features to ensure the best experience to your customers:
- Disable the "Submit" `<button>` while the `CardElement` information is not `complete`, by listening to the `onChange` event;
- Disable the `CardElement` and "Submit" `button` during the tokenization request inside the `submit` function;
- Display the full `token` response;
- Log any tokenization errors to the `console`;

See it running and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-elements-react)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-cards-with-elements-react?fontsize=14&hidenavigation=1&theme=dark&module=/src/CheckoutForm.tsx,/src/App.tsx" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

---
layout: default
title: Collect Credit Cards with React
permalink: /guides/collect-atomic-cards-with-elements-react/
categories: guides
nav_order: 4
has_children: true
has_toc: false
description: Basis Theory
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Collect Credit Cards with React

Retain control of your card data while enabling your business to use any current or new processing relationships as you extend your business's product lines, look to increase auth rates, or reduce your overall cost of payments.  No matter why you're here, we will always enable you to use the data how you want to use it. Even if that means exporting the data out of Basis Theory.

Basis Theory is here to make sure you can keep the lowest level of PCI compliance while retaining your ability to use your card data whenever and however you need to. We enable you to capture cards via form elements, exchange or forward that data to any other approved vendor or processor, and continue to grow and extend your business into its next growth cycle!

If you'd like to follow along with this guide from scratch, we suggest creating a new React sandbox using <a href="http://codesandbox.io/">codesandbox.io</a> and getting started from there! Want to jump right into our sample app? <a href="https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-atomic-cards-with-elements-react">Find it here!</a>

## Let's code

<span class="base-alert warning">
  <span>
    To start, you'll need a new Elements Application with the <code>token:pci:create</code> permission
  </span>
</span>

Install our dedicated React package:

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

Create a `CheckoutForm` component and add it somewhere in your `App` content.

Declare a `CardElement` inside it and call the tokenization method `atomicCards.create` passing the underlying card element instance:

```jsx
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';

export const CheckoutForm = () => {
  const { bt } = useBasisTheory();

  const submit = async () => {
      try {
        const token = await bt.atomicCards.create({
          card: bt?.getElement('myCard'),
        });
      } catch (error) {
        console.error(error);
      }
  };
  return (
    <>
        <CardElement id="myCard" />
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

## Next steps

The created token in `submit` function can be used in a variety of ways:
- You can fetch the card data later in your server, using a Server-to-Server [Application](https://docs.basistheory.com/api-reference/#applications) Key to call [Get an Atomic Card API](https://docs.basistheory.com/api-reference/#atomic-cards-get-an-atomic-card);
- Call one of our Reactors to process that card data. [Here is how to do that with Node.js](/guides/collect-atomic-cards-with-elements/#setup-and-use-a-token-reactor);
- Make a third party API request with the raw data through our [Proxy](https://docs.basistheory.com/api-reference/#proxy). Feel free to [contact us](mailto:support@basistheory.com?subject=CardElement%20and%20Proxy%20usage) for more information on how to do it.

## See it in action

In this example we also:
- Disable the "Submit" `<button>` while the `CardElement` information is not `complete`, by listening to the `onChange` event;
- Disable the `CardElement` and "Submit" `button` during the tokenization request inside the `submit` function;
- Display the full stringified `token` response;
- Log any tokenization errors to the `console`;

See it running and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-atomic-cards-with-elements-react)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/eng-1984/collect-atomic-cards-with-elements-react?fontsize=14&hidenavigation=1&theme=dark&module=/src/CheckoutForm.tsx,/src/App.tsx" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

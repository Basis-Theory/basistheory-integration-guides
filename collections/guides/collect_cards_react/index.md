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
{: .no_toc }

IDK what to say here

### Table of contents
{: .no_toc .text-delta }
1.
{:toc}

## Add Elements to your website

<span class="base-alert warning">
  <span>
    To start, you'll need a new Elements Application with the <code>token:pci:create</code> permission
  </span>
</span>

Install our dedicated React package:

```bash
npm install --save @basis-theory/basis-theory-react
```

Initialize the Basis Theory SDK passing the API Key to the `useBasisTheory` hook:

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

Declare a `CardElement` in your form component and pass it in the tokenization method `atomicCards.create`:

```jsx
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';

export const CheckoutForm = () => {
  const { bt } = useBasisTheory();

  const submit = async () => {
      try {
        const token = await bt.atomicCards.create({
          card: bt?.getElement('myCard'),
        });    
        // 
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

## See it in action
{: .no_toc }

In this example we also:
- Disable the "Submit" `<button>` while the `CardElement` information is not `complete`, by listening to the `onChange` event;
- Disable the `CardElement` and "Submit" `button` during the tokenization request inside the `submit` function;
- Display the full stringified `token` response;
- Log any tokenization errors to the `console`;

See it running and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-atomic-cards-with-elements-react)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/eng-1984/collect-atomic-cards-with-elements-react?fontsize=14&hidenavigation=1&theme=dark&module=/src/CheckoutForm.tsx,/src/App.tsx" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>

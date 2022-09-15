---
layout: default
title: Collect Customer Data (PII) with React
permalink: guides/collect-pii-react/
categories: guides
subcategory: secure
nav_order: 2
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---
# Collect Customer Data (PII) with React

Basis Theory is built to handle any payload of data you can serialize. Once you've completed this guide, you'll know how to use our [React package](https://www.npmjs.com/package/@basis-theory/basis-theory-react) to of how to collect and secure your customer's PII (Personally Identifiable Information) data in 3 simple steps with our Elements, keeping it safe and secure.

If you'd like to follow along with this guide from scratch, we suggest creating a new React sandbox using <a href="http://codesandbox.io/">codesandbox.io</a> and getting started from there! Want to jump right into our sample app? <a href="https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-pii-with-elements-react">Find it here!</a>

## Let's code

<span class="base-alert warning">
  <span>
    To start, you'll need a <code>Public</code> [Application](https://docs.basistheory.com/api-reference/#applications) with the <code>token:pii:create</code> permission. <a href="https://portal.basistheory.com/applications/create?application_template_id=da06cf91-caf4-44f4-886a-ab3d71d9ca5f" target="_blank">Click here to create one.</a>
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

Create a `RegistrationForm` component and add it somewhere in your `App` content.

Create two `refs` that will be used to store the underlying elements instances.

Declare two `TextElement` tags inside it, one for the "Full Name", and the other for the "Social Security Number"; then call the `tokenize` method passing the current elements instance from the `refs`:


```jsx
import { useRef } from 'react';
import { TextElement, useBasisTheory } from '@basis-theory/basis-theory-react';

export const RegistrationForm = () => {
  const { bt } = useBasisTheory();
  const fullNameRef = useRef(null);
  const ssnRef = useRef(null);

  const submit = async () => {
      try {
          const response = await bt.tokenize({
              fullName: fullNameRef.current,
              ssn: {
                  type: 'social_security_number',
                  data: ssnRef.current,
              },
          });
      } catch (error) {
        console.error(error);
      }
  };
  return (
    <>
        <TextElement id="fullName" ref={fullNameRef} />
        <TextElement id="ssn" ref={ssnRef} />
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

Success! 🎉 Your application is now collecting and storing PII in Basis Theory platform.

## Next steps

You can further customize the [`TextElement` props](https://docs.basistheory.com/elements/#textelement) to best suit your needs.

The Tokens you've created from your frontend application can be used in a variety of ways from within your system, check out a few of those below:
- Fetched later in your servers, using a Private Application Key (<a href="https://portal.basistheory.com/applications/create?application_template_id=fa77330e-c50d-4f56-a6cb-6342711ae37d" target="_blank">click here to create one</a>) to call [Get a Token API](https://docs.basistheory.com/api-reference/#tokens-get-a-token);
- Used to call on of our [Reactors](https://docs.basistheory.com/api-reference/#reactors) to process that data. Some use cases are:
    - Integrating with third party KYC platforms, such as [Alloy](https://www.alloy.com);
    - Pull credit reports for your customers without touching their data;
    - Send e-mails or instant messages to communication channels;
    - Pull background checks;
- Make a third party API request with the raw data through our [Proxy](https://docs.basistheory.com/api-reference/#proxy).

## See it in action

The example below uses a few of the [Element's user experience](https://docs.basistheory.com/elements/#introduction) features to ensure the best experience to your customers:
- Pass a `mask` to the `ssn` field, restricting user input to digits only and formatting the output;
- Use a `transform` option in the `ssn` field to strip out dash '-' characters from the tokenized data;
- Disable the "Submit" `<button>` while the `fullName` field is empty or the `ssn` field is not `complete`, by listening to their `onChange` event;
- Disable both inputs and the "Submit" `button` during the tokenization request inside the `submit` function;
- Display the full stringified `tokens` response;
- Log any tokenization errors to the `console`;

See it running and the code that drives it below. Want to experience the sandbox yourself? [Check it out here.](https://codesandbox.io/s/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-pii-with-elements-react)

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/github/Basis-Theory/basis-theory-js-examples/tree/master/collect-pii-with-elements-react?fontsize=14&hidenavigation=1&theme=dark&module=/src/RegistrationForm.tsx,/src/App.tsx" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>
---
layout: default
title: Styling Elements 
permalink: /guides/style-elements-for-my-brand/
categories: guides
nav_order: 3
has_children: true
has_toc: true
---
# How to style Elements for my brand
{: .no_toc }

Our Elements has been built to act as if it were just a normal input field within your own application. We've taken care in building out the supported styles and needs of our customers. In this guide, we will walk you through a few of the different styles you can adjust.

Want to just jump into an example? [Check it out here](https://codesandbox.io/s/styling-elements-sample-0eyoh)!

### Table of contents
{: .no_toc .text-delta }

1. Add Elements to your website 
{:toc}


## Update the base variant of Elements

The base variant in our style object enables you to update the way the input fields look during most user interactions. (invalid, typing, etc).

For security reasons, we only support fonts that are supported from Google's list of fonts. If you're looking to support an additional font that you can't find, reach out and let us know in [our Discord](https://discord.gg/XjWsy8PqK2).


```js
var cardElement = BasisTheory.elements.create('card', {
    style: {
        fonts: [
            "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
        ],
        base: {
            color: "#fff",
            fontWeight: 500,
            fontFamily: "'Source Sans Pro'",
            fontSize: "16px",
            fontSmooth: "antialiased",
            "::placeholder": {
            color: "#6b7294"
        },
    }
})
```

## Update variant styles

These styling configurations allow you to easily update what happens when users engage with the input fields, no matter if that is when an invalid value is entered or when they simply hover over the fields.

Ready to see all of the options our variants provide? Checkout our [Elements Style Documentation](https://docs.basistheory.com/elements/#element-style).

```js
var cardElement = BasisTheory.elements.create('card', {
    style: {
        fonts: [
            "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
        ],
        invalid: {
            color: "#ffc7ee"
        },
        complete: {
            color: "#1ad1db"
        }
    }
})
```

### See it in action:
{: .no_toc }

See a sample and the code that drives it below, want to experience the sandbox yourself? [Check it out here](https://codesandbox.io/s/styling-elements-sample-0eyoh).

<div class="iframe-container">
  <iframe src="https://codesandbox.io/embed/styling-elements-sample-0eyoh?fontsize=14&hidenavigation=1&theme=dark" class="iframe-code" allowfullscreen="" frameborder="0"></iframe>
</div>
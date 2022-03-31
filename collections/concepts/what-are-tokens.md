---
layout: post
title:  "Tokens"
categories: concepts
permalink: /concepts/what-are-tokens/
nav_order: 3
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# What are tokens?

Tokens are the core of the Basis Theory platform, built to enable companies to remove the need to store sensitive data
while granting the flexibility they need to grow and operate their businesses. Tokens are a reference to the sensitive
data that's stored in our system. Our tokens enable you to pass raw data to our platform, and we will handle keeping it 
safe for you while returning a non-sensitive token identifier for you to reference from your systems.

## How is the data stored?

When you tokenize unencrypted data with Basis Theory, we will carefully encrypt the data with industry standard
encryption algorithms. We ensure the data has been encrypted with a one-time use encryption key, which is then encrypted
again and stored within our platform. This foundational encryption ensures your data is uniquely encrypted each time a
new token is created. We will never mix our customers' encryption keys. Your keys are only used for your data, period.

## What types of data can I tokenize?

You can tokenize any type of data with Basis Theory - from one of our pre-defined 
[token types](https://docs.basistheory.com/api-reference/#token-types) to arbitrary 
unstructured data, Basis Theory can help you tokenize and secure all your data. Basis Theory leverages token types to 
indicate the type of data contained within a token, and several properties of the token are driven off the token type, 
such as:
 - how the data is validated
 - the mask pattern
 - whether the token is fingerprinted
 - default privacy settings

In order to enable fine-grained data governance and access controls, every token is assigned
a [Classification](https://docs.basistheory.com/api-reference/#tokens-token-classifications) indicating the type of data
that it contains and an [Impact Level](https://docs.basistheory.com/api-reference/#tokens-token-impact-levels)
indicating the sensitivity level of the data.

The Basis Theory [token permissions](https://docs.basistheory.com/api-reference/#permissions-permission-types) model is
driven by these Classifications and Impact Levels. We enable and encourage you to restrict your applications to the
minimal subset of Classifications and lowest Impact Levels necessary for the given use case.

The following table provides an overview of each of the supported token types. As a best practice, you should use the
most specific token type and data classification possible for a given piece of data.

| Token Type               | Classification | When to use it?                                           |
|--------------------------|----------------|-----------------------------------------------------------|
| `card_number`            | `pci`          | Storing credit card numbers in a PCI-compliant manner     |
| `us_bank_routing_number` | `bank`         | Storing ABA routing numbers                               |
| `us_bank_account_number` | `bank`         | Storing ABA account numbers                               |
| `social_security_number` | `pii`          | Storing US Social Security numbers                        | 
| `employer_id_number`     | `pii`          | Storing US employer Id numbers (EIN)                      | 
| `token`                  | `general`      | Storing any other type of structured or unstructured data | 

See [our docs](https://docs.basistheory.com/api-reference/#token-types) for more information about each of these token types.

<span class="base-alert info">
  <span>
    Looking for a token type that is not listed here? 
    Please reach out to us on our [Discord channel](https://discord.gg/NSvXxaW5Fv) or via email at [support@basistheory.com](mailto:support@basistheory.com)
  </span>
</span>

## Try it out

Want to see our tokens in action? Try out our [Quickstart Guide](/guides/basis-theory-sample-app). 

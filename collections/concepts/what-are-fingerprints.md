---
layout: post
title:  "Fingerprints"
categories: concepts
permalink: /concepts/what-are-fingerprints/
nav_order: 5
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# What Is Fingerprinting?

Tokenizing data replaces raw values with a Token Identifier referencing sensitive data, meaning you don’t have the raw value in your database. Without the raw value, your system isn’t able to perform simple queries that your application may require - for example, what if you need to check for duplicate or existing values? Fingerprints solve this problem by providing you an identifier representing your Token’s uniqueness without needing to read the decrypted data.

<span class="base-alert info">
  <span>
    Need access to the data? Our [Reactors](https://developers.basistheory.com/concepts/what-are-reactors/) and [Proxy](https://developers.basistheory.com/concepts/what-is-the-proxy/) enable you to share, compute, and analyze anything with your sensitive data without it touching your systems.
  </span>
</span>

## How It Works

Every [Token Type](https://docs.basistheory.com/#token-types) that supports fingerprinting and is created with the same data will have the same fingerprint. Fingerprints are:
 - A non-reversible random unique identifier. It is not derived from the data.
 - Unique to the underlying data 
 - Unique to the Token Type
 - Unique to the Tenant

For example, a social security number in a single tenant would generate the same fingerprint every time it is tokenized. For the same value in a different tenant, it would generate a different fingerprint, unique to that tenant.

[Learn which token types support fingerprinting.](https://docs.basistheory.com/#token-types)

Due to its non-sensitive nature, fingerprints can be stored in any environment. Even if the fingerprint were leaked or compromised there is no way to reverse it. Fingerprints are immune to brute force attacks because they are unique to your tenant.
Take a look at this sample request and response:

```js
curl "https://api.basistheory.com/tokens" \
  -H "Content-Type: application/json" \
  -H "BT-API-KEY: <BT_API_KEY>" \
  -X "POST"  \
  -d '{
        "data": {
          "number": "4242424242424242",
          "expiration_month": 12,
          "expiration_year": 2022,
          "cvc": "123"
        },
        "type": "card"
      }'
```

The fingerprint returned in this example is `2145bff2044846149d15ea1d61d6d78e`:

```js
{
  "id": "30682aa3-3b94-4b69-9387-6bc47fe44861",
  "type": "card",
  "card": {
    "number": "XXXXXXXXXXXX4242",
    "expiration_month": 12,
    "expiration_year": 2022
  },
  "fingerprint": "2145bff2044846149d15ea1d61d6d78e",
  "tenant_id": "5ac0f15c-65c8-4420-8569-e0ed8281a06e",
  "created_by": "bf96df08-fb80-4438-967c-a5c3d80343b8",
  "created_at": "2022-03-28T14:13:49.506Z"
}
```

If you run the same request again, you can see that the fingerprint is still `2145bff2044846149d15ea1d61d6d78e`, because the underlying data is the same. However, the Token ID is unique for each token:

```js
{
  "id": "201b2979-a9b2-42f6-8263-6500939ee7ce",
  "type": "card",
  "card": {
    "number": "XXXXXXXXXXXX4242",
    "expiration_month": 12,
    "expiration_year": 2022
  },
  "fingerprint": "2145bff2044846149d15ea1d61d6d78e",
  "tenant_id": "5ac0f15c-65c8-4420-8569-e0ed8281a06e",
  "created_by": "bf96df08-fb80-4438-967c-a5c3d80343b8",
  "created_at": "2022-03-28T14:20:57.236Z"
}
```

## Common Use Cases

### Fraud detection

Financial systems need to detect and alert on possible fraud. Without viewing the credit card or bank information in plain text, it can be difficult to check whether you’ve seen that account before or not. Fingerprinting provides a simple answer to that problem. Imagine you receive two payments from the same credit card, one in New York City, the other in Los Angeles, just 10 minutes apart. That sounds fraudulent! Both tokens would have the same fingerprint, giving your system the ability to recognize the same card and take the appropriate action.

### Identity protection

The social security number token type supports fingerprinting and when generated, a system can immediately detect whether that SSN is already associated with an existing account. All without the system searching through the underlying plaintext data or needing to decrypt or manage potentially reversible hashes itself.

### Account linking

Some services need to link accounts to track activity, usage, award loyalty points, and more. Imagine a household where two people share a credit card and use it on your service separately. Although the card Tokens belong to two different users in the system, and the Token itself is unique for each, the fingerprint is the same between the two. Using the fingerprint associated with each Token, you can relate the two accounts in your system. (Note: as illustrated in the fraud detection use case, making this determination based on credit card alone is not enough. It is used only as a simple illustration of the power of fingerprints.)

## FAQs

### Why use fingerprints and not Search?

Fingerprints are values you are able to store in your local database after you create the token. This allows you to use them in your entire stack, run queries against them and your data, and integrate it into your own data analytics. It saves an additional API call out to your Basis Theory Vault to search for the data, giving your system immediate feedback on whether that data is unique or not. All you need to query is your database!

Our search API is extremely powerful, letting you search through the encrypted data without decrypting it first (keep in mind, this will make tokens Active, which affects your Monthly Active Token usage). Fingerprinting provides a viable alternative for recognizing data patterns without increasing your MAT usage.

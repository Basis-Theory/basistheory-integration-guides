---
layout: post
title:  "What are Atomic Tokens?"
categories: concepts
permalink: /concepts/what-are-atomic-tokens/
nav_order: 3
has_children: true
has_toc: false
---

# What are Atomic Tokens?

### How do Atomic Tokens work?

Atomic Token enable your business to reduce its overall security and compliance footprint while also reducing the complexity of your application. We take on all of the compliance, regulatory, and security responsibilities to store your data at rest and enable multiple different solutions for getting your sensitive data into our platform to reduce your overall liability footprint. These tokens have a well defined property mapping enabling you to easily use the data within our platform.

## Atomic Banks

Our Atomic Bank model enables quick and easy compliance with the latest NACHA encryption regulations. As a NACHA approved partner, we can have you quickly securing your customers bank account details.

```js
    curl "https://api.basistheory.com/atomic/banks" \
      -H "X-API-KEY: key_N88mVGsp3sCXkykyN2EFED" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "bank": {
                "routing_number": "021000021",
                    "account_number": "1234567890"
            },
            "metadata": {
                "nonSensitiveField": "Non-Sensitive Value"
            }
        }'
```
Learn more about Atomic Banks in our [developer documentation](https://docs.basistheory.com/api-reference/#atomic-banks).

## Atomic Cards

If you need to secure and store PCI credit card data, you are enabled to call our API directly or embed our Card Elements into your browser-based application. These Atomic Cards enable your business to future proof against change and continue to build your business using new partners and integrations - all while never having to touch the underlying card data or implement costly PCI compliance controls.

```js
 curl "https://api.basistheory.com/atomic/cards" \
  -H "X-API-KEY: key_N88mVGsp3sCXkykyN2EFED" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
        "card": {
            "number": "4242424242424242",
                "expiration_month": 12,
                "expiration_year": 2025,
                "cvc": "123"
        },
        "billing_details": {
            "name": "John Doe",
                "email": "johndoe@test.com",
                "phone": "555-123-4567",
                "address": {
                "line1": "111 Test St.",
                    "line2": "Apt 304",
                    "city": "San Francisco",
                    "state": "CA",
                    "postal_code": "94141",
                    "country": "US"
            }
        },
        "metadata": {
            "nonSensitiveField": "Non-Sensitive Value"
        }
    }'
```

Learn more about Atomic Cards in our [developer documentation](https://docs.basistheory.com/api-reference/#atomic-cards).


Want to learn more about how you can use our Atomic types to enable your business to take advantage of your highest sensitive data? [Check out how to collect Credit Cards with our Elements](/guides/collect-atomic-cards-with-elements/).
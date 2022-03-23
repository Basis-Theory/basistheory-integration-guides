---
layout: default
title: Use Token Data in Reactors
permalink: /guides/use-token-data-in-reactors/
categories: guides
subcategory: processing
nav_order: 6
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Use Token Data in Reactors
{: .no_toc }

In this guide, we will walk through several options for how you can invoke a Reactor using your tokenized data.

Based on your use specific cases, you may prefer to store your sensitive data with Basis Theory using our
[Atomic Tokens](/concepts/what-are-atomic-tokens), one of our pre-defined [Token Types](https://docs.basistheory.com/#token-types),
or even use your own custom data schema within a schemaless [generic token](https://docs.basistheory.com/#token-types-token).
However you choose to tokenize your sensitive data, Basis Theory grants you the flexibility to use this data within
our serverless Reactor platform.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Prerequisites

If Reactors are completely new to you, we recommend you first read our [Reactors](/concepts/what-are-reactors) concept page or
the [Setup your first Reactor](/guides/setup-your-first-reactor) guide.

For the examples below, we will be using a Reactor created using the `Spreedly - Card` Reactor Formula, unless the 
example explicitly calls out otherwise. We will need the `id` of this Reactor in the examples below: `d08bc998-9301-495c-a2e5-04f8dc0916b4`.

This Reactor Formula accepts the following [request parameters](https://docs.basistheory.com/#reactor-formulas-reactor-formula-object):

| name                    | type     | optional |
|:------------------------|:---------|:---------|
| `card.number`           | *string* | false    |
| `card.expiration_month` | *number* | false    |
| `card.expiration_year`  | *number* | false    |
| `card.cvc`              | *string* | true     |
| `card_owner_full_name`  | *string* | false    |

These examples will be using the Detokenization feature of Reactors to interpolate token identifiers and insert 
sensitive token data into the Reactor request. For more background information about Detokenization, see our [api docs](https://docs.basistheory.com/#reactors-invoke-a-reactor).

## Using Atomic Tokens

In this example, we will show how you can invoke the Spreedly Card Reactor using an [Atomic Card](https://docs.basistheory.com/#atomic-cards-atomic-card-object) token:

```json
{
  "id": "815029c2-29ec-4fc2-8cd4-99feb3ee582c",
  "type": "card",
  "data": {
    "number": "4242424242424242", 
    "expiration_month": 11,
    "expiration_year": 2025,
    "cvc": "123"
  }
}
```

Say we have not tokenized the card owner's name, `John Doe`, and we have this plaintext value available to our application. 
Then we can invoke the Spreedly Reactor with this token by calling:

```bash
curl "https://api.basistheory.com/reactors/d08bc998-9301-495c-a2e5-04f8dc0916b4/react" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "args": {
              "card": "{%raw%}{{815029c2-29ec-4fc2-8cd4-99feb3ee582c}}{%endraw%}",
              "card_owner_full_name": "John Doe"
            }
        }'
```

Then the Spreedly Reactor will receive the following request data:

```json
{
  "args": {
    "card": {
      "number": "4242424242424242",
      "expiration_month": 11,
      "expiration_year": 2025,
      "cvc": "123"
    },
    "card_owner_full_name": "John Doe"
  }, 
  "configuration": {...}
}
```

## Using Multiple Tokens

In this example, we will show how you can invoke the Spreedly Card Reactor using a [Card Number](https://docs.basistheory.com/#token-types-card-number) token and a 
generic `PII` token to hold the card owner's name.

Assume we have created the following tokens:

```json
{
  "id": "d9939ddc-d7be-423b-a0f5-69f65fec57df",
  "type": "card_number",
  "data": "5555555555554444",
  "privacy": {
    "classification": "pci",
    "impact_level": "high"
  }
}
```

```json
{
  "id": "f4d86311-1254-4155-b532-b651279a8cc0",
  "type": "token",
  "data": "Jane Doe",
  "privacy": {
    "classification": "pii",
    "impact_level": "moderate"
  }
}
```

In this example, we have not tokenized the card's expiration date - say our application accepts these values in 
plaintext and forwards them directly into the Reactor.
Then we can invoke the Spreedly Reactor with this data by calling:

```bash
curl "https://api.basistheory.com/reactors/d08bc998-9301-495c-a2e5-04f8dc0916b4/react" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "args": {
              "card": {
                "number": "{%raw%}{{d9939ddc-d7be-423b-a0f5-69f65fec57df}}{%endraw%}",
                "expiration_month": 10,
                "expiration_year": 2024
              },
              "card_owner_full_name": "{%raw%}{{f4d86311-1254-4155-b532-b651279a8cc0}}{%endraw%}"
            }
        }'
```

Then the Spreedly Reactor will receive the following request data:

```json
{
  "args": {
    "card": {
      "number": "5555555555554444",
      "expiration_month": 10,
      "expiration_year": 2024
    },
    "card_owner_full_name": "Jane Doe"
  }, 
  "configuration": {...}
}
```

<span class="base-alert info">
  <span>
    Note that this example uses tokens having classifications `pci` and `pii`, so the API key used must be for an 
    application having both `token:pci:use:reactor` and `token:pii:use:reactor` permissions (<a href="https://portal.basistheory.com/applications/create?type=server_to_server&permissions=token%3Apci%3Ause%3Areactor&permissions=token%3Apii%3Ause%3Areactor&name=Reactor User" target="_blank">click here to create one</a>).
  </span>
</span>

## Combine Multiple Tokens within a Single Argument

In this example, we will show how you can combine the data from multiple tokens within a single Reactor argument. Say we have 
chosen to store the card holder's first and last names as separate tokens:

```json
{
  "id": "523949a9-e32f-4b5b-a0ad-7a435c79deb4",
  "type": "token",
  "data": "John"
}
```

```json
{
  "id": "42af9170-e6ca-4ea7-a43b-730a0b47b6d0",
  "type": "token",
  "data": "Brown"
}
```

Also, we have the atomic card token:

```json
{
  "id": "b78b4bee-5499-42dd-8671-f1d23d32355b",
  "type": "card",
  "data": {
    "number": "5105105105105100", 
    "expiration_month": 5,
    "expiration_year": 2025,
    "cvc": "123"
  }
}
```

Then we can invoke the Spreedly Reactor concatenating the first and last name tokens within the `card_owner_full_name` argument by calling:

```bash
curl "https://api.basistheory.com/reactors/d08bc998-9301-495c-a2e5-04f8dc0916b4/react" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "args": {
              "card": "{%raw%}{{b78b4bee-5499-42dd-8671-f1d23d32355b}}{%endraw%}",
              "card_owner_full_name": "{%raw%}{{523949a9-e32f-4b5b-a0ad-7a435c79deb4}} {{42af9170-e6ca-4ea7-a43b-730a0b47b6d0}}{%endraw%}"
            }
        }'
```

Then the Spreedly Reactor will receive the following request data:

```json
{
  "args": {
    "card": {
      "number": "5105105105105100",
      "expiration_month": 5,
      "expiration_year": 2025,
      "cvc": "123"
    },
    "card_owner_full_name": "John Brown"
  }, 
  "configuration": {...}
}
```

## Using Custom Token Schemas

In this example, we will store our card data within a custom generic token that contains additional fields relevant to our application:

```json
{
  "id": "9a48a051-972b-4569-8fd5-cbe17a604f96",
  "type": "token",
  "data": {
    "card": {
      "number": "4000056655665556",
      "expiration_month": 4,
      "expiration_year": 2026
    },
    "card_owner_full_name": "John Smith",
    "billing_address": {
      "street_address": "175 5th Ave",
      "city": "New York",
      "state": "NY",
      "zip": "10010"
    }
  },
  "privacy": {
    "classification": "pci",
    "impact_level": "high"
  }
}
```

Then we can invoke the Spreedly Reactor with this token data by calling:

```bash
curl "https://api.basistheory.com/reactors/d08bc998-9301-495c-a2e5-04f8dc0916b4/react" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "args": "{%raw%}{{9a48a051-972b-4569-8fd5-cbe17a604f96}}{%endraw%}"
        }'
```

And the Spreedly Reactor will receive the following request data:

```json
{
  "args": {
    "card": {
      "number": "4000056655665556",
      "expiration_month": 4,
      "expiration_year": 2026
    },
    "card_owner_full_name": "John Smith"
  }, 
  "configuration": {...}
}
```

Notice that the `billing_address` and its child properties were not forwarded to the Reactor because they were not declared as accepted request parameters on the `Spreedly - Card` Reactor Formula.

## Implicit Type Conversions

In this example, we will illustrate how data is implicitly converted into the `type` declared on a Reactor Formula's request parameters,
even if that data is stored as a different underlying type within a Basis Theory token. Say we have created the following token:

```json
{
  "id": "e24fd837-ad97-4fa1-9510-78039ba8089e",
  "type": "token",
  "data": {
    "card": {
      "number": "5200828282828210",
      "expiration_month": "02",
      "expiration_year": "2027"
    }
  },
  "privacy": {
    "classification": "pci",
    "impact_level": "high"
  }
}
```

Notice that the `expiration_month` and `expiration_year` fields are stored as a `string` within the token, but recall that the `Spreedly - Card`
declared these request parameters as type `number`.
We can still invoke the Spreedly Reactor with this token data by calling:

```bash
curl "https://api.basistheory.com/reactors/d08bc998-9301-495c-a2e5-04f8dc0916b4/react" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "args": {
              "card": "{%raw%}{{e24fd837-ad97-4fa1-9510-78039ba8089e}}{%endraw%}",
              "card_owner_full_name": "John Williams"
        }'
```

Then the expiration date fields will be automatically casted to a `number` type and the Spreedly Reactor will receive the following request data:

```json
{
  "args": {
    "card": {
      "number": "5200828282828210",
      "expiration_month": 2,
      "expiration_year": 2027
    },
    "card_owner_full_name": "John Williams"
  }, 
  "configuration": {...}
}
```

## Using a Subset of Data in a Token

For this example, we will be using the `Parrot` Reactor Formula, which only accepts a single request parameter:

| name                    | type     | optional |
|:------------------------|:---------|:---------|
| `card.number`           | *string* | false    |

Say we have created a Parrot Reactor from this formula with the id `2bd573ae-8d0f-47a9-95d0-03e6428574a0`.
While, you could use a single `card_number` token to supply this `card.number` property, we will be showing how an 
[Atomic Card](https://docs.basistheory.com/#atomic-cards-atomic-card-object) token can also be used to 
provide this value, even though the Atomic Card contains more data fields than this Reactor requires.

Say you have stored the Atomic Card token:

```json
{
  "id": "cbc43a9b-8d6c-4e05-95e9-1e8d506d0026",
  "type": "card",
  "data": {
    "number": "6011000990139424", 
    "expiration_month": 9,
    "expiration_year": 2023,
    "cvc": "123"
  }
}
```

Then we can invoke the Parrot Reactor with this token data by calling:

```bash
curl "https://api.basistheory.com/reactors/2bd573ae-8d0f-47a9-95d0-03e6428574a0/react" \
      -H "BT-API-KEY: key_NS21v84n7epsSc5WzoFjM6" \
      -H "Content-Type: application/json" \
      -X "POST" \
      -d '{
            "args": {
              "card": "{%raw%}{{cbc43a9b-8d6c-4e05-95e9-1e8d506d0026}}{%endraw%}"
            }
        }'
```

Then the Parrot Reactor will receive the following request data:

```json
{
  "args": {
    "card": {
      "number": "6011000990139424"
    }
  }, 
  "configuration": {...}
}
```

Notice that the additional `expiration_month`, `expiration_year`, and `cvc` properties were not forwarded to the Reactor. 
Additional properties within a token's data that do not match a Reactor Formula's declared request parameters are automatically removed from the request.


---
layout: post
title:  "Permissions"
categories: concepts
permalink: /concepts/understanding-permissions/
nav_order: 7
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Understanding Classifications, Impact Levels, and Permissions

Every [Application](https://developers.basistheory.com/concepts/what-are-applications/) you create has a unique set of permissions that control what operations you can perform with that Application’s API Key. Token Permissions are configured based on the operation, the Token Classification, and the Token Impact Level. Let’s explore how these three things come together with Permissions to give you control over Token access.

## Impact Levels

Basis Theory defines its [Impact Levels](https://docs.basistheory.com/#tokens-token-impact-levels) using the [standard NIST-defined](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.199.pdf#page=6) `low`, `moderate`, and `high`. Impact Levels provide a framework for understanding the potential harm of a security breach. `Low` is for data that poses the least risk, where the impact would be limited if the data were leaked; examples include the expiration date for a credit card, the routing number for a bank, or the state someone lives in. `Moderate` is for data that would have a serious impact to the organization or user; examples include phone numbers and zip codes. `High` is for data that would have a severe or catastrophic impact to the organization or user; examples include social security numbers, driver’s license numbers, and account numbers.

All [Token Types](https://docs.basistheory.com/#token-types) have a default Impact Level. When creating a token of any type you are able to change the default Impact Level, as long as it doesn’t go lower than the minimum level defined for that Token Type. For example, `employer_id_number`'s have a default Impact Level of `high` but can be set to `low`; `card_number` Tokens, however, must always have a `high` Impact Level.

```
curl "https://api.basistheory.com/tokens" \
  -H "BT-API-KEY: <BT_API_KEY>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "type": "token",
    "data": "Sensitive Value",
    "privacy": {
      "impact_level": "moderate"
    }
  }'
```

## Classifications

Token Classifications define the type of data inside the Token. Basis Theory supports four different Classifications:

1. `bank` indicates that the Token contains data that falls under banking compliance, such as Nacha.
2. `pci` indicates that the Token contains data that requires PCI compliance.
3. `pii` indicates that the Token contains Personally Identifiable Information.
4. `general` is for all Tokens that don’t need a more specific classification or compliance requirement.

<span class="base-alert info">
  <span>
    Need a different classification? [Contact us!](https://basistheory.com/contact)
  </span>
</span>

As with the Impact Levels, each Token Type has a default Classification which can be overridden as long as it doesn’t become less specific than the default Classification. You cannot “downgrade” a Token from `pci` to `general`.

```
curl "https://api.basistheory.com/tokens" \
  -H "BT-API-KEY: <BT_API_KEY>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "type": "token",
    "data": "Sensitive Value",
    "privacy": {
      "classification": "pii"
    }
  }'
```

## Restriction Policies

In addition to the Impact Level and Classification, Tokens can have a Restriction Policy set. Basis Theory supports two policies: `mask` and `redact`. When the Token is read by an Application with permission to read only lower Impact Levels than the Token, the Restriction Policy defines whether the Token’s data should be masked or redacted. For example, the `social_security_number` Token Type has a default Restriction Policy of `mask` and a default Impact Level of `high`. If an Application that only has permission to read `low` Impact Level Tokens attempts to read a social security number, the data will be returned masked:

```
curl "https://api.basistheory.com/tokens" \
  -H "BT-API-KEY: <BT_API_KEY>" \
  -H "Content-Type: application/json" \
  -X "POST" \
  -d '{
    "type": "social_security_number",
    "data": "123-45-6789"
  }'
```

```
curl "https://api.basistheory.com/tokens/<TOKEN_ID>" \
  -H "BT-API-KEY: <BT_API_KEY>" \
  -H "Content-Type: application/json" \
  -X "GET"

{
  "id": "8deb3363-288a-49b2-8c5f-e6b598a8afff",
  "type": "social_security_number",
  "data": "XXX-XX-6789",
  "privacy": {
    "classification": "pii",
    "impact_level": "high",
    "restriction_policy": "mask"
  },
  "tenant_id": "c28392d1-15ec-479a-ac15-bbe2764ad66d",
  "created_by": "b848d641-71fb-439d-808a-efbb8237c282",
  "created_at": "2022-04-20T23:12:10.401Z"
}
```

## Permissions

Each [Application Type](https://docs.basistheory.com/#applications-application-types) has its own set of permissions to choose from (view the [full list here](https://docs.basistheory.com/#permissions-permission-types)).  `Client-side` and `Elements` Applications are only able to `create` Tokens, ensuring that you are able to safely use the Application Key in your client-side code without worrying about a malicious actor using that key to decrypt your data. `Management` Applications can manage infrastructure items only, such as Tenants and Applications, and they cannot interact with Tokens; all other Application Types are restricted to data operations with Tokens. Token permissions come in the format `token:<classification>:<operation>:<scope?>`, for instance `token:bank:read:low` or `token:pci:use:proxy`.

Token Permissions control three things:

1. What Classification of Tokens the Application has access to interact with
2. What operations the Application can use (create, delete, use, etc.)
3. How the detokenized plain text data is returned when reading a Token

The `<classification>` segment of the permission tells you what Classification of Token the Application can interact with. If an Application is only granted the `token:pii:create` permission, it cannot create a Token with the Classification `pci` or `bank`.

Which operations an Application can use is likewise controlled by the permissions. If an Application has the `token:pii:delete` permission only, it cannot create any Tokens, only delete Tokens with the Classification of `pii`. `use` is an additional operation to the standard CRUD operations that allows an Application to detokenize Tokens of that classification within the [Proxy](https://developers.basistheory.com/concepts/what-is-the-proxy/) or [Reactors](https://developers.basistheory.com/concepts/what-are-reactors/) (`*:use:proxy` or `*:use:reactor` respectively).

The last consideration when determining what permissions to grant an Application is the Impact Level. Applications can only `read` the plain text value of Tokens that have the same or lower Impact Level than the permission. For instance, if an Application has the `token:pii:read:high` permission, it can read all Tokens classified as `pii` regardless of their Impact Level. However, if the Application only has `token:pii:read:low`, the only Tokens it can fully detokenize are those with the `low` Impact Level. If the Application tries to read a Token with a higher Impact Level (in this example, `moderate` or `high`), the data will be returned either masked or redacted, depending on the Restriction Policy assigned to the Token.
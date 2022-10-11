---
layout: post
title:  "Tokens"
categories: concepts
permalink: /concepts/what-are-tokens/
nav_order: 1
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

### Table of contents
{: .no_toc }
1. 
{:toc}

# What are tokens?

Tokens are the core of the Basis Theory platform, built to enable companies to remove the need to store sensitive data while granting the flexibility they need to grow and operate their businesses. Tokens are a reference to the sensitive data that’s stored in our system. Our tokens enable you to pass raw data to our platform, and we will handle keeping it safe for you while returning a non-sensitive token identifier for you to reference from your systems.

# How is the data stored?

When you tokenize data with Basis Theory, we will carefully encrypt the data with NIST and FIPS-compliant encryption algorithms. We ensure the data has been encrypted with a one-time use encryption key, which is then encrypted again and stored within our platform. This foundational encryption ensures your data is uniquely encrypted each time a new token is created. We will never mix our customers’ encryption keys. Your keys are only used for your data, period.

# What types of data can I store?

You can store any primitive, complex, or unstructured data with our `token` type. This can enable you to store a user record, a simple social security number, or the contents of a file.

There are [token types](https://docs.basistheory.com/#token-types) available, such as `card` and `bank` types, to simplify your integration by offering pre-configured capabilities described in this page. If you are interested in more token types, please [reach out](https://support.basistheory.com/hc).

# What operations can I do with tokens?

You can manage the [full lifecycle](https://docs.basistheory.com/#tokens) of all of your tokens. This includes creating, updating, reading, detokenizing, searching, and deleting tokens. Basis Theory offers the ability to also create tokens in bulk via the [tokenize API endpoint](https://docs.basistheory.com/#tokenize). This endpoint provides a way to create multiple tokens while preserving the format of your request.

You can also make use of the token time to live (TTL) capability to expire your tokenized data.

# What are the capabilities of a token?

Our token specification enables you to transform your data to optimize for storage, readability, searching, and permissions. Basis Theory utilizes [Liquid template expressions](https://docs.basistheory.com/expressions/#language) to enable full control over all parts of your tokenized data.

## Aliasing

In some scenarios, you need your token identifier to be in a specific format. This may be because you have to pass existing validation requirements, have an existing data format or database schema that is hard to change. Aliasing provides a simple way to customize the format of your token identifier to meet your needs.

Let’s assume you have a social security number you are storing and you want to alias the token identifier to match the SSN format:

**Request**

{% raw %}
```json
{
  "id": "{{ data | alias_preserve_format }}",
  "type": "token",
  "data": "123-45-6789"
}
```
{% endraw %}

**Response**

```json
{
  "id": "384-28-3948",
  "type": "token"
}
```

Another example may be that you want to format your email and retain the domain on the email while preserving the length of the email identifier so you can search for an instance of the email domain in your database without exposing the actual email addresses:

**Request**

{% raw %}
```json
{
  "id": "{{ data | split: '@' | first | alias_preserve_length }}@{{ data | split: '@' | last }}",
  "type": "token",
  "data": "johndoe@basistheory.com"
}
```
{% endraw %}

**Response**

```json
{
  "id": "difkelk@basistheory.com",
  "type": "token"
}
```

## Fingerprinting

Fingerprinting provides a way to correlate multiple tokens together that contain the same data without needing access to the underlying data. Creating multiple tokens with the same token type, data, and [fingerprint expression](https://docs.basistheory.com/expressions/#fingerprints) will result in the same fingerprint. This can be useful for correlating purchases with the same credit card for multiple members of the same household or helping with master data management of multiple user accounts.

By default, all tokens are fingerprinted with the contents of the `data` property using the default fingerprint expression of `{% raw %}{{ data | stringify }}{% endraw %}`, however you can customize this fingerprint expression to meet your needs of what should uniquely identify a token.

In the following example, we will create a token with user data, but we want to fingerprint on the email address:

**Request**

{% raw %}
```json
{
  "type": "token",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email_address": "johndoe@basistheory.com"
  },
  "fingerprint_expression": "{{ data.email_address }}"
}
```
{% endraw %}

**Response**

{% raw %}
```json
{
  "id": "1e7f0dde-5442-40ab-b244-5e02bcd5f86d",
  "type": "token",
  "fingerprint": "PH12E7vY7HfRTdGVUDeLzRcP8",
  "fingerprint_expression": "{{ data.email_address }}"
}
```
{% endraw %}

In the above example, if another token is created with the `email_address` of `johndoe@basistheory.com`, the same fingerprint value of `PH12E7vY7HfRTdGVUDeLzRcP8` will be returned. If a token with a different `email_address` is created, a different fingerprint value will be returned.

## Masking

Masking is a way to securely and compliantly reveal parts of sensitive data. This is useful for revealing the last 4 digits of a credit card number to a customer during a checkout process or the last part of a social security number for a customer service representative to verify account ownership.

Masks are computed based on the current value of the token data. [Updating the token](https://docs.basistheory.com/#tokens-update-token) will change what masked data is returned.

A scenario where masking is useful is in enabling customer service representatives to verify the account information for a customer using the last four of a social security number without having access to the full SSN. In this example, we will mask customer data so representatives can securely and compliantly view only part of the customer record:

**Request**

{% raw %}
```json
{
  "type": "token",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "social_security_number": "111-22-3333",
    "email_address": "johndoe@basistheory.com"
  },
  "mask": {
    "first_name": "{{ data.first_name }}",
    "last_name": "{{ data.last_name | slice: 0 }}.",
    "social_security_number": "{{ data.social_security_number | reveal_last: 4 }}",
    "email_address": "{{ data.email_address | split: '@' | last }}"
  }
}
```
{% endraw %}

**Response**

{% raw %}
```json
{
  "id": "ae164fcd-227d-40ce-b7ec-435faa6a8c73",
  "type": "token",
  "data": {
    "first_name": "John",
    "last_name": "D.",
    "social_security_number": "XXX-XX-3333",
    "email_address": "basistheory.com"
  },
  "mask": {
    "first_name": "{{ data.first_name }}",
    "last_name": "{{ data.last_name | slice: 0 }}.",
    "social_security_number": "{{ data.social_security_number | reveal_last: 4 }}",
    "email_address": "{{ data.email_address | split: '@' | last }}"
  }
}
```
{% endraw %}

## Privacy Settings

Privacy settings are [NIST defined](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.199.pdf#page=6) classification and impact levels, defined for each token to identify the type and impact of the data on your systems. These settings are used to permit the data within your internal systems, allowing certain systems access to highly confidential data and restricting access to other systems by masking or redacting the data.

In a scenario where we want to store a customer’s social security number, we only want to provide access to the last 4 of the SSN to our customer service team:

{% raw %}
```json
{
  "type": "token",
  "data": "123-45-6789",
  "mask": "{{ data | reveal_last: 4 }}",
  "privacy": {
    "classification": "pii",
    "impact_level": "high",
    "restriction_policy": "mask"
  }
}
```
{% endraw %}

In the above example, if an application has a `token:pii:read:high` permission, they can read the original, plaintext value of the token. If they have a `token:pii:read:low` or `token:pii:read:moderate` permission, they will receive the masked `data` of `XXX-XX-6789`. If the application does not have any `token:pii:read` permission, they will not have access to the token.

## Time to Live (TTL)

The time to live token capability provides the ability to expire your token data. This is useful in scenarios such as an expiring credit card, to share temporary credentials for system or user access, or meeting data retention policies.

This example shows how to expire a token with card data:

```json
{
  "type": "token",
  "data": {
    "number": "4242424242424242",
    "expiration_month": 12,
    "expiration_year": 2025
  },
  "expires_at": "2025-12-31T00:00:00+00:00"
}
```

In this example, once the expires_at date has passed, the entire token will be purged and no longer available.

## Auditing

All activities around tokens are audited, including `create`, `read`, `update`, `delete` and whenever a token is proxied or used in a Reactor. These audit logs are available [via the API](https://docs.basistheory.com/#logs) or the web portal. Also, the creator and last modifier of a token is stored on all tokens. This can be used to lookup which application was used to create or update a token.

**Request**

```json
{
  "type": "token",
  "data": "John Doe"
}
```

**Response**

```json
{
  "id": "c06d0789-0a38-40be-b7cc-c28a718f76f1",
  "type": "token",
  "created_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "created_at": "2020-09-15T15:53:00+00:00",
  "modified_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "modified_at": "2020-09-15T15:53:00+00:00"
}
```

## Search Indexes

Once data is encrypted, it is difficult to search through the data for business processes without having full access. Basis Theory enables you to create search indexes on parts of the data within a token to allow searching without ever decrypting the underlying data or providing access to the sensitive data.

In this example, we have a customer account we want to search over parts of the data:

{% raw %}
```json
{
  "type": "token",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "social_security_number": "111-22-3333",
    "email_address": "johndoe@basistheory.com"
  },
  "search_indexes": [
    "{{ data.first_name | downcase }}",
    "{{ data.last_name | downcase }}",
    "{{ data.social_security_number }}",
    "{{ data.social_security_number | last4 }}",
    "{{ data.email_address | downcase }}",
    "{{ data.email_address | split: '@' | last }}"
  ]
}
```
{% endraw %}

In the above example, we can now perform a search with `john`, `doe`, `111-22-3333`, `3333`, `johndoe@[basistheory.com](http://basistheory.com)` or `basistheory.com` and get back the token. To see all additional capabilities of search, see our [API documentation](https://docs.basistheory.com/#tokens-search-tokens).

## Deduplication

Duplicate data can be problematic for some systems. This can create data integrity problems in some systems where unique 
values are required. For example, you may have an accounts payable system and an e-commerce system both accepting 
credit cards for customers, and you want to ensure duplicate credit cards are not on file for that customer. 
Deduplication ensures tokens that have the same `fingerprint` return the same token when created. 
By default, every tokenization request creates a new token, but with deduplication [enabled at the tenant](https://docs.basistheory.com/#tenants-tenant-settings-object) 
or on each [tokenization request](https://docs.basistheory.com/#tokens-create-token), tokens will be deduplicated based 
upon their fingerprint. This ensures that if multiple systems or the same system creates multiple tokens with the same 
data, they do not create duplicate tokens.

To deduplicate a token during the tokenization request, we pass the `deduplicate_token` flag to the create token request. 
This will override the tenant-level deduplicate tokens setting:

```json
{
  "type": "token",
  "data": "123-45-6789",
  "deduplicate_token": true
}
```

In this scenario, if we detect an existing token with the same `fingerprint`, the existing token is returned instead of 
creating a new token. When an existing token is matched, its data and metadata will only be returned within the response
if the requester has `token:read` permission to the matched token. If the requesting Application does not have read
permission, then the `data`, `metadata`, and other potentially sensitive attributes will be redacted to prevent 
leaking information to unauthorized parties. Only the following properties will be included in redacted responses: 
`id`, `type`, `tenant_id`, `fingerprint`, `privacy`, and `container`.

## Metadata

Being able to tag your tokens with custom attributes is important in many scenarios. For instance, you may want to add a system identifier to your tokens that allows you to reference a record in your own database. Another scenario is you need to tag records that fall into certain compliance requirements (e.g. GDPR). In these scenarios, putting this information in the token data may not be ideal as you want to be able to quickly reference the information or expose it to audiences who do not have access to view the token data. To solve for this, Basis Theory tokens allow you to set your own metadata on any token utilizing key-value pairs.

**Request**

```json
{
  "type": "token",
  "data": "John Doe",
  "metadata": {
    "customer_id": "123abc"
  }
}
```

**Response**

```json
{
  "id": "a2f1defa-da99-44e7-b70b-4e6dcfa20ec2",
  "type": "token",
  "metadata": {
    "customer_id": "123abc"
  }
}
```

## Associations

Associations enable you to build relationships between your data. You can construct your relationships into trees or chains enabling you to discover and traverse your data efficiently.

You can easily manage the relationship between a `parent` and `child` token via our [token association API endpoints](https://docs.basistheory.com/#token-associations).

# Use Cases

## Tokenize Credit Cards

**Request**

{% raw %}
```json
{
  "id": "{{ data.number | alias_preserve_format }}",
  "type": "card",
  "data": {
    "number": "4242424242424242",
    "expiration_month": 12,
    "expiration_year": 2025,
    "cvc": "123"
  },
  "fingerprint_expression": "{{ data.number }}",
  "mask": {
    "number": "{{ data.number | reveal_last: 4 }}",
    "expiration_month": "{{ data.expiration_month }}",
    "expiration_year": "{{ data.expiration_year }}"
  },
  "search_indexes": [
    "{{ data.number }}",
    "{{ data.number | last4 }}"
  ],
  "privacy": {
    "classification": "pci",
    "impact_level": "high",
    "restriction_policy": "mask"
  }
}
```
{% endraw %}

**Response**

{% raw %}
```json
{
  "id": "3829018309324938",
  "type": "card",
  "data": {
    "number": "XXXX XXXX XXXX 4242",
    "expiration_month": 12,
    "expiration_year": 2025
  },
  "fingerprint": "M25bjMqlH85LZE2F7SmZ1w",
  "fingerprint_expression": "{{ data.number }}",
  "mask": {
    "number": "{{ data.number | reveal_last: 4 }}",
    "expiration_month": "{{ data.expiration_month }}",
    "expiration_year": "{{ data.expiration_year }}"
  },
  "search_indexes": [
    "{{ data.number }}",
    "{{ data.number | last4 }}"
  ],
  "privacy": {
    "classification": "pci",
    "impact_level": "high",
    "restriction_policy": "mask"
  },
  "created_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "created_at": "2020-09-15T15:53:00+00:00",
  "modified_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "modified_at": "2020-09-15T15:53:00+00:00"
}
```
{% endraw %}

<span class="base-alert info">
  <span>
    In order to maintain PCI compliance while capturing credit cards, you will need to use Basis Theory's `card` token type or store the CVC in a separate `token` while setting `expires_at` TTL property.
  </span>
</span>

## Tokenize Bank Data

**Request**

{% raw %}
```json
{
  "type": "token",
  "data": {
    "routing_number": "110000000",
    "account_number": "00123456789"
  },
  "fingerprint_expression": "{{ data.routing_number }}{{ data.account_number }}",
  "mask": {
    "routing_number": "{{ data.routing_number }}",
    "account_number": "{{ data.account_number | reveal_last: 4 }}"
  },
  "search_indexes": [
    "{{ data.routing_number }}",
    "{{ data.account_number }}",
    "{{ data.account_number | last4 }}"
  ],
  "privacy": {
    "classification": "bank",
    "impact_level": "high",
    "restriction_policy": "mask"
  }
}
```
{% endraw %}

**Response**

{% raw %}
```json
{
  "id": "1457aad3-db95-4b34-8e14-b8ffffc305b4",
  "type": "token",
  "data": {
    "routing_number": "110000000",
    "account_number": "XXXXXXX6789"
  },
  "fingerprint": "sPbj5G5tKLIX42vrTGgk0Q",
  "fingerprint_expression": "{{ data.routing_number }}{{ data.account_number }}",
  "mask": {
    "routing_number": "{{ data.routing_number }}",
    "account_number": "{{ data.account_number | reveal_last: 4 }}"
  },
  "search_indexes": [
    "{{ data.routing_number }}",
    "{{ data.account_number }}",
    "{{ data.account_number | last4 }}"
  ],
  "privacy": {
    "classification": "bank",
    "impact_level": "high",
    "restriction_policy": "mask"
  },
  "created_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "created_at": "2020-09-15T15:53:00+00:00",
  "modified_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "modified_at": "2020-09-15T15:53:00+00:00"
}
```
{% endraw %}

## Tokenize User Data

**Request**

{% raw %}
```json
{
  "type": "token",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "social_security_number": "111-22-3333",
    "email_address": "johndoe@basistheory.com"
  },
  "fingerprint_expression": "{{ data.social_security_number }}",
  "mask": {
    "first_name": "{{ data.first_name }}",
    "last_name": "{{ data.last_name | slice: 0 }}.",
    "social_security_number": "{{ data.social_security_number | reveal_last: 4 }}",
    "email_address": "{{ data.email_address | split: '@' | last }}"
  },
  "search_indexes": [
    "{{ data.first_name | downcase }}",
    "{{ data.last_name | downcase }}",
    "{{ data.social_security_number }}",
    "{{ data.social_security_number | last4 }}",
    "{{ data.email_address | downcase }}",
    "{{ data.email_address | split: '@' | last }}"
  ],
  "privacy": {
    "classification": "pii",
    "impact_level": "high",
    "restriction_policy": "mask"
  }
}
```
{% endraw %}

**Response**

{% raw %}
```json
{
  "id": "be654efd-f748-4dcf-8640-96a1061e29fe",
  "type": "token",
  "data": {
    "first_name": "John",
    "last_name": "D.",
    "social_security_number": "XXX-XX-3333",
    "email_address": "basistheory.com"
  },
  "fingerprint": "qRhehf8MqDlEIKPTpQhU6g",
  "fingerprint_expression": "{{ data.social_security_number }}",
  "mask": {
    "first_name": "{{ data.first_name }}",
    "last_name": "{{ data.last_name | slice: 0 }}.",
    "social_security_number": "{{ data.social_security_number | reveal_last: 4 }}",
    "email_address": "{{ data.email_address | split: '@' | last }}"
  },
  "search_indexes": [
    "{{ data.first_name | downcase }}",
    "{{ data.last_name | downcase }}",
    "{{ data.social_security_number }}",
    "{{ data.social_security_number | last4 }}",
    "{{ data.email_address | downcase }}",
    "{{ data.email_address | split: '@' | last }}"
  ],
  "privacy": {
    "classification": "pii",
    "impact_level": "high",
    "restriction_policy": "mask"
  },
  "created_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "created_at": "2020-09-15T15:53:00+00:00",
  "modified_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "modified_at": "2020-09-15T15:53:00+00:00"
}
```
{% endraw %}

## Tokenize Credentials

**Request**

{% raw %}
```json
{
  "type": "token",
  "data": {
    "username": "johndoe",
    "password": "8n%C%r+4DG*7BdPjZ6km9Nc#"
  },
  "expires_at": "2022-07-15T00:00:00+00:00",
  "privacy": {
    "impact_level": "high",
    "restriction_policy": "redact"
  }
}
```
{% endraw %}

**Response**

{% raw %}
```json
{
  "id": "4bc29335-38fd-4f71-8f36-c63ee8965be7",
  "type": "token",
  "fingerprint": "Rs2U7r4cwN137j9XRO88zg",
  "fingerprint_expression": "{{ data | stringify }}",
  "expires_at": "2022-07-15T00:00:00+00:00",
  "privacy": {
    "impact_level": "high",
    "restriction_policy": "redact"
  },
  "created_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "created_at": "2020-09-15T15:53:00+00:00",
  "modified_by": "fb124bba-f90d-45f0-9a59-5edca27b3b4a",
  "modified_at": "2020-09-15T15:53:00+00:00"
}
```
{% endraw %}

---
layout: post
title:  "Search"
categories: concepts
permalink: /concepts/what-is-search/
nav_order: 6
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# What is Search?

Encrypting data has always come with one costly tradeoff: it makes searching over your data very complicated. 
Basis Theory’s search feature aims to make that as simple and painless as possible, without any need to detokenize or 
decrypt your data.

## How It Works

When the Token is created the data is securely indexed in several data patterns using blind indexes. Combining the 
blind indexes with the existing metadata on the tokens allows you to search your entire Vault with a simple query. 
You can search over the following fields:

- `data`
- `type`
- `metadata.[key]`
- `created_at`

Currently, Basis Theory supports searching `data` on `social_security_number`, `employer_id_number`, and `token` 
[Token Types](https://docs.basistheory.com/#token-types). The data is indexed in several patterns for 
`social_security_number` and `employer_id_number` [Token Types](https://docs.basistheory.com/#token-types), 
allowing for flexible searching. For instance, you can search for a social security number by the full number with or 
without dashes (`123-45-6789` and `123456789`), and only the last four (`6789`). For `token` 
[Token Types](https://docs.basistheory.com/#token-types), you can create indexes to fit your use case. Find out all the 
details [here](https://docs.basistheory.com/expressions/#search-indexes).

## Permissions

In order to search Tokens using the API, you must use an Application with the `token:search`
[permission](https://docs.basistheory.com/#permissions-permission-types). The search results are filtered based on the 
permissions associated with the Application; you cannot search for tokens you do not have permission to access.

## Query Syntax

Basis Theory uses a [Lucene-based query syntax](http://www.lucenetutorial.com/lucene-query-syntax.html) to power the 
search engine. Searching is case-insensitive, however only exact matches are currently supported. Wildcard searches are 
not available at this time. The search query is a string with one or more terms in the format `field:value`. 
For instance, if you want to find all social security numbers, you would query:

```
type:social_security_number
```

To search Token `data` on Types that support it, you can search for the indexed data patterns. To search for Tokens 
containing the data `123-45-6789`, you would query:

```
data:123-45-6789
```

If you are searching over data that contains multiple words or spaces, you can wrap the search value in quotes:

```
data:"data containing multiple words"
```

Searching Tokens using metadata is supported as well. Metadata search terms use dot notation for key in the form 
of `metadata.key:value`. For example, to search for Tokens having the metadata `{ customer_id: "123456" }`, query for:

```
metadata.customer_id:123456
```

Date range searches are supported using the Lucene bracketed range syntax. `[START_DATE TO END_DATE]` denotes an
inclusive range and `{START_DATE TO END_DATE}` denotes an exclusive range. Values are formatted as a string in 
ISO 8601 format and can either represent a date or date and time in UTC. For example, to search for tokens that were 
created in the year 2021, you can query:

```
created_at:[2021-01-01 TO 2021-12-31T23:59:59Z]
```

To search a range without a start or end date, use the wildcard `*` in place of the start or end date, for example:

```
created_at:{* TO 2022-01-01}
```

Multiple terms may be combined using the `AND` and `OR` operators and grouped using parentheses. For example:

```
(type:social_security_number AND metadata.user_id:1234) OR data:111-11-1111
```

Only the Lucene query operators described above are supported at this time. If you would like to have support for any 
additional Lucene features, please [let us know](mailto:support@basistheory.com?subject=Token).

## FAQ

### What is the difference between Search and Fingerprints?

[Fingerprints](https://developers.basistheory.com/concepts/what-are-tokens/#fingerprinting) are a measure of uniqueness, 
not a representation of the underlying data. Fingerprints can be used to locate duplicate data, for instance, but do not 
allow you to find *specific* data. You cannot find a card number ending in `4242` with fingerprints.

### How does searching Tokens affect my Monthly Active Token usage?

Each Token that matches the search query made via the API and is returned in the result set becomes an Active Token for 
that month. Searching through the Portal as a logged in user will not affect MAT usage.

---
layout: post
title:  Token Containers
categories: concepts
permalink: /concepts/what-are-token-containers/
nav_order: 2
has_children: true
has_toc: false
image:
path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
width: 1200
height: 630
---

# What are Token Containers?

Tokens can be logically grouped into Containers to segment Tokens within a Tenant. 
Containers can be leveraged to construct fine-grained access control policies by attaching one or more 
[Access Rules](/concepts/access-controls/) to an Application. 
Each Access Rule can be scoped to a specific Container of tokens, allowing you to grant an Application 
permission to interact with only a subset of tokens within your Tenant.

A Container is represented by a hierarchical path, which is conceptually similar to directories in a UNIX filesystem.
Container names must start and end with a `/`, and the root Container is denoted by `/`. Container names may include any 
alphanumeric characters, `-`, or `_`, and can contain an arbitrary number of nested sub-containers.

You have complete control to customize your Container hierarchy to meet your unique data governance requirements. 
By default, Tokens will be assigned to Containers based off their data classification and impact levels, using the format 
`/<classification>/<impact_level>/`, e.g. `/pci/high/` or `/general/low/`.

A Token's Containers can be modified through the [Update Token](https://docs.basistheory.com/#tokens-update-token) endpoint,
provided that the Application performing the update has `token:update` permission to both the source and 
destination Containers.


## Common Use Cases

### Segmenting by data classification

To segment tokens by data classification, you could organize your tokens into the following containers:

- `/pci/`
- `/general/`
- `/pii/`

This would enable you to create Applications that are only granted access to a specific classification of data. 
For example, a billing system could be granted access to only the `/pci/` container, while a 
customer service system could only be granted access to the `/pii/` container in order to support user account management.

<img alt="Containers" src="/assets/images/concepts/containers_by_classification.png">

### Segmenting by customer

To segment tokens by customer, you could organize your tokens into the following containers:

- `/customer-1/`
- `/customer-2/`
- `/customer-3/`

This would enable you to create Applications that are only granted access to one or more specific customers' data. 

Tokens may also be further segmented within each customer's container, as needed. For example, you could partition a customer's
data by classification, say between payments related Tokens and Tokens used to store a customer's contact information. 
You could achieve this by further dividing Tokens into the sub-containers: 

- `/customer-2/pci/`
- `/customer-2/pii/`

<img alt="Containers" src="/assets/images/concepts/containers_by_customer.png">
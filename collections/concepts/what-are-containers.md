---
layout: post
title:  Token Containers
categories: concepts
permalink: /concepts/what-are-token-containers/
nav_order: 3
has_children: true
has_toc: false
image:
path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
width: 1200
height: 630
---

# What are Token Containers?

Token Containers are hierarchical grouping constructs that allow you to logically segment tokens within your tenant. With
this grouping in place, you are then able to control access to your tokens based on [Access Rules](https://developers.basistheory.com/concepts/access-controls/) 
tied to applications that specify which containers an Application has access to. 

A container is represented by a hierarchical path, which is conceptually similar to directories in a UNIX filesystem.
Container names must start and end with a `/`, and the root container is denoted by `/`. Container names may include any 
alphanumeric characters, `-`, or `_`, and can contain an arbitrary number of nested sub-containers.

You have complete control to customize your container hierarchy to meet your unique data governance requirements. By default,
tokens will be assigned to containers based off of their data classification and impact levels, using the format 
`/<classification>/<impact_level>/`, e.g. `/pci/high/` or `/general/low/`.

---

## Common Use Cases

### Segmenting by data classification

If you need to segment tokens by data classification, you could organize your tokens into the following containers:

- `/pci/`
- `/bank/`
- `/pii/`
- `/general/`
- `/my-custom-classification/`

---

### Segmenting by customer

If you need to segment tokens by customer, you could organize your tokens into the following containers:

- `/customer-123/`
- `/customer-456/`
- `/customer-789/`
- `/customer-xyz/`

---
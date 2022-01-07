---
layout: post
title:  "What is the Proxy?"
categories: concepts
permalink: /concepts/what-is-the-proxy/
nav_order: 4
has_children: true
has_toc: false
image:
path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
width: 1200
height: 630
---

# What is the Proxy?

Tokenizing with Basis Theory gives you the ability to offload the collection and storage of sensitive data.
While it is critical that your sensitive data is stored securely, it is just as important that you are able to continue to use and share this data in a secure and compliant manner.

Data is often shared between systems via HTTP APIs. Typically these HTTP requests are built and sent within your own application code, but what if the HTTP request requires a piece of sensitive data that you have tokenized and stored with Basis Theory?
Instead of retrieving this token data and accessing the raw sensitive values directly within your application, the Basis Theory Proxy provides a mechanism to forward the HTTP request through Basis Theory and have the raw token data substituted in the request.
Your application can include non-sensitive token identifiers in the original HTTP request, and Basis Theory will detokenize those identifiers into the raw token data within the request before forwarding the modified request to the destination.

ADD GRAPHIC HERE

Add more content here...

## Potential Use Cases

UNDER CONSTRUCTION!!!

## Samples

[Use Token Data in HTTP Requests](/guides/use-token-data-in-http-requests/)

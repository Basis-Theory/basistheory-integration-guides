---
layout: post
title:  "What Is the Proxy?"
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

# What Is the Proxy?

Your data is one of your most valuable assets. 
While it is critical that your sensitive data is collected and stored securely, it's just as important that your data remains available to be used or shared in order to derive value from it.
Basis Theory strives to make your tokenized data easily available for any of your potential use cases, offering a number of tools for interacting with your data, such as our Serverless Reactor platform and the Proxy, 

It is a common need in modern software development to share data between systems via HTTP based APIs, but what if the HTTP request requires a piece of sensitive data that you have tokenized and do not have direct access to?
The Proxy enables you to build and send HTTP requests from your systems containing sensitive tokenized data in a secure and compliant manner. 
Your applications can send a non-sensitive request payload through Basis Theory's systems to substitute token data into the request before forwarding it to the desired destination. 

The end result is that you can call HTTP APIs with tokenized data without needing to touch the underlying sensitive data directly within your systems.


## How It Works

Your system initiates an outbound HTTP requests to a Basis Theory hosted URL.
The request is transformed according to instructions provided in HTTP headers and by detokenizing any standard token interpolation patterns included in the request.
Finally, the request is delivered to the destination URL that was specified through the `BT-PROXY-URL` HTTP header.

The Proxy terminates the inbound TLS connection and initiates another TLS connection to the destination in order to guarantee secure transmission of your sensitive token data.
For this reason, we require the destination to support TLSv1.2+ and that the destination URL uses `https`. 

**ADD GRAPHIC HERE**

Detokenization is performed within the request on any patterns that match `{%raw%}{{tokenId}}{%endraw%}`, where `tokenId` is the id of a token created within your tenant.

The application that is being used to call the Proxy must be explicitly granted `token:<classification>:use:proxy` permission on any tokens that are detokenized. 
You should restrict which classifications of tokens an application has access to detokenize in the Proxy by only granting the minimum set of `token:<classification>:use:proxy` permissions that are necessary for each use case.


## Common Use Cases

### Share sensitive data with a third party

Basis Theory offers a number of out-of-the-box integrations to share your tokenized data with Third Party systems via our Serverless Reactor platform.

However, you may require an integration that is not yet supported, in which case you have a few easy options to choose from:
1. Create a custom Reactor Formula containing the code required to integrate with the third party system
2. Use the Proxy to send the API request from your own systems and let Basis Theory detokenize

Using the Proxy can provide a quicker and lower configuration option for making custom HTTP requests to a third party API than writing and maintaining a custom reactor formula.

### Upgrade an existing system

If you have an existing system that stores sensitive data that you wish to secure, this data can be migrated out of your systems and tokenized with Basis Theory.
You can replace the existing data stored within your system with the corresponding tokens. However, your existing system may have been integrated with one or more external systems over an HTTP API.
You can leverage the Proxy in order to minimize the impact of this change on your existing codebase.   

To continue to send the original tokenized data through these integrations, we only need to make a few simple modifications to these requests:

- Update the URL for the request to https://api.basistheory.com/proxy
- Include a `BT-PROXY-URL` header containing the original destination URL
- Include an `X-API-KEY` header containing an API key for a Basis Theory application that has `token:<classification>:use:proxy` permission
- Update your HTTP request to include a token interpolation pattern (`{%raw%}{{tokenId}}{%endraw%}`) instead of the original data value


## Samples

[Use Token Data in HTTP Requests](/guides/use-token-data-in-http-requests/)

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

It is a common need to share data between software systems via HTTP based APIs, but what if the HTTP request requires a piece of sensitive data that you have tokenized and do not want to access directly within your application?

The Proxy enables you to build HTTP requests containing sensitive tokenized data and send them from your systems in a secure and compliant manner without needing to access raw token data. 
Your application can include token identifiers within the request payload and send this request through Basis Theory's systems to substitute token data into the request before forwarding it to the desired destination. 

The end result is that you can call HTTP APIs with tokenized data without needing to touch the underlying sensitive data directly within your systems.


## How It Works

Your system initiates an outbound HTTP request to the Proxy hosted by Basis Theory.
The request is transformed by detokenizing any standard token interpolation patterns included in the request (patterns of the form `{%raw%}{{tokenId}}{%endraw%}`, where `tokenId` is the id of a token created within your tenant). Any token interpolation patterns will be replaced with the decrypted `data` value of this token.
Finally, the request is delivered to the destination URL that was specified through a `BT-PROXY-URL` HTTP header.

**[INSERT GRAPHIC HERE]**

The Proxy terminates the inbound TLS connection from your servers and initiates a new TLS connection to the destination in order to guarantee secure transmission of your sensitive token data.
For this reason, we require the destination servers to support TLSv1.2+ and that the provided destination URL uses `https`.

The application that is being used to call the Proxy must be explicitly granted `token:<classification>:use:proxy` permission on any tokens that are detokenized. 
You should restrict which classifications of tokens an application has access to detokenize through the Proxy by only granting the minimum set of `token:<classification>:use:proxy` permissions that are necessary for your use case.

To send an HTTP request through the Proxy:
- Include a `BT-PROXY-URL` header containing the original destination URL
- Include a `BT-API-KEY` header containing an API key for a Basis Theory application that has `token:<classification>:use:proxy` permission
- Update your HTTP request to include one or more token interpolation pattern(s) (`{%raw%}{{tokenId}}{%endraw%}`) where you would have included the original data value(s)
- Send the request to https://api.basistheory.com/proxy

For further details, check out [our docs](https://docs.basistheory.com/api-reference/#proxy).

## Common Use Cases

### Share sensitive data with a third party

Tokenized data can be included in any HTTP request to a third party API by executing the HTTP request through the Proxy. 
This makes it easy to share sensitive data with a third party without needing to first retrieve and manipulate this sensitive data on your servers.

### Upgrade an existing system

If you have an existing system that stores sensitive data that you wish to secure, this data can be migrated out of your systems and tokenized with Basis Theory.
You can replace the existing data stored within your system with the corresponding tokens. However, your existing system may have been integrated with one or more external systems over an HTTP API.
You can leverage the Proxy in order to minimize the impact of this change on your existing codebase.


## How to choose between the Proxy and Serverless Reactors

Basis Theory offers a number of out-of-the-box integrations to share your tokenized data with Third Party systems via our Serverless Reactor platform.

However, you may require an integration that is not yet supported, in which case you have a few options to choose from:
1. Create a custom Reactor Formula containing the code required to integrate with the third party system (our serverless platform executes this code)
2. Use the Proxy to send the API request from your own application (your servers execute this code)

Using the Proxy can provide a quicker and lower configuration option for making custom HTTP requests to a third party API than writing and maintaining a custom reactor formula.


## Samples

[Use Token Data in HTTP Requests](/guides/use-token-data-in-http-requests/)

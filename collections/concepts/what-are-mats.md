---
layout: post
title:  "Monthly Active Tokens"
categories: concepts
permalink: /concepts/what-are-mats/
nav_order: 4
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# What are Monthly Active Tokens?

Monthly Active Tokens (MATs) are the primary metric that drives Basis Theory's [pricing](https://basistheory.com/pricing) model.
In this guide, we'll walk through how MATs are defined and some nuances around how they are counted. 
We will also explore how MATs are used to determine your monthly Basis Theory invoice. 


## How are MATs defined?

A MAT is any [token](/concepts/tokens) that has been interacted with in a given calendar month via one of the following operations:

### Create

When a token is created, it will be counted as a MAT for the current month. If the [tokenize](https://docs.basistheory.com/#tokenize)
API endpoint is used to bulk create several tokens in one request, all created tokens are counted as separate MATs.

Any tokens that are created in the `tokenize` output of a Reactor will also be counted as MATs.

### Read

Whenever a token is retrieved from the API it is counted as a MAT. This could include:
- Retrieving a single [token by id](https://docs.basistheory.com/#tokens-get-a-token) - the returned token will be counted as a MAT.
- Retrieving a [list of tokens](https://docs.basistheory.com/#tokens-list-tokens) - any tokens returned from the list API will be counted as MATs.
- [Searching tokens](https://docs.basistheory.com/#tokens-search-tokens) - any tokens returned from the search API will be counted as MATs.

For paginated API endpoints, only the tokens included in the returned page(s) are counted as MATs. 
Tokens that match your search criteria that are contained within other non-fetched pages will not be counted as MATs.

### Use

Any token that is used within a [Reactor](/concepts/what-are-reactors) or the [Proxy](/concepts/what-is-the-proxy) will be counted as a MAT.
This includes any tokens that were [Detokenized](https://docs.basistheory.com/detokenization/#introduction) within a Reactor or Proxy request.

<span class="base-alert info">
    <span>
    A token is only counted as a Monthly Active Token if it has been interacted with through the Basis Theory API. 
    Tokens that are viewed or interacted with through the Portal are not counted as MATs.
    </span>
</span>


## How are MATs counted?

MATs are counted separately per [Tenant](/concepts/what-are-tenants) and are not aggregated across your Tenants. 
If you own more than one Basis Theory Tenant, e.g. for multiple environments to support your SDLC process, 
then each tenant accrues MATs and billing charges according to its own usage.

Interacting with a given token more than once does not increase your MAT count or incur additional charges - 
each token is counted as a MAT at most once per month. 
For example, if in a given month you create a token, read it several times, and use this token within a Reactor and the Proxy, 
then this token will only be counted as a single MAT for the month.

Likewise, [detokenizing](https://docs.basistheory.com/detokenization/#introduction) a single token multiple times within a Reactor or Proxy request,
for example to select multiple properties from a token using a [JSON Path](https://docs.basistheory.com/detokenization/#transformations-json-path) transformation,
will only cause that token to be counted as a single MAT.

Deleting a token does not cause it to be counted as a MAT. 
However, if you previously interacted with a token causing it to become counted as a MAT, then delete the token in the same month, 
the token is still counted as a MAT for that month even after deleting it.

The monthly period in which MATs accumulate is based on UTC time, and each Tenant's MAT counts are reset to 0 at the start of a new month. 
A token being counted as a MAT in one month has no impact on it being counted as a MAT again in another month - 
a given token can be counted as a MAT in consecutive months if it has been interacted with in both months.


## How is my monthly invoice calculated?

Your invoice will be calculated based on the specific terms of your plan - either the standard Developer plan or a Custom plan.

For the Developer plan, you are allowed 1,000 free MATs every month before any charges will be incurred.
If a Tenant exceeds 1,000 MATs, you will be billed at a rate of $0.10/MAT for any MATs over this free amount. 
For example, if you have a Tenant that has accrued 1,200 MATs in a month, you will be billed for 200 MATs and will incur a charge of `200 * $0.10 = $20.00` for the month. 

Once a Tenant exceeds the 1,000 free MATs, you will be prompted to enter a payment method to continue using Basis Theory.
In order to facilitate your evaluation of Basis Theory, you will not be immediately blocked from continued usage of Basis Theory's services,
and will have a short grace period to enter your payment details while continuing evaluation.

<span class="base-alert info">
  <span>
    Are you interested in using Basis Theory in production?
    Please [contact us](https://basistheory.com/contact) to discuss a Custom plan with volume discount pricing tailored to your organization's needs.
  </span>
</span>

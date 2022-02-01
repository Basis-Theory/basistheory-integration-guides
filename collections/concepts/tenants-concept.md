---
layout: post
title:  Tenants
categories: concepts
permalink: /concepts/tenants/
nav_order: 3
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# What are Tenants?

Everything starts with a Tenant in your Basis Theory account. This is where you configure Basis Theory and where your Tokens and Applications are defined, managed, and stored. You’re allowed to create as many tenants as you’d like within Basis Theory and you can use these to isolate different domains of data and to support your Software Development Life Cycle (SDLC).

## How It Works

To create a new Tenant, you’ll need to login to your Basis Theory Account and select the tenant name you are currently logged in to, finally create a new Tenant:

<img src="/assets/images/concepts/tenant_selector.png">

You are now able to create a blank new Tenant, by entering a tenant name:

<img src="/assets/images/concepts/tenant_create.png">

From here, you’ll be able to create new Applications which will allow you to authenticate and be granted authorization to create new [Token](https://guides.basistheory.com/concepts/what-are-tokens/) data and integrations.

## Common Use Cases

### Software Development Life Cycle Tenants
In software development lifecycles companies typically create separate isolated and identical systems that create a division between each type of environment. For example, developers and teams create Production environments to house their actual customer data and multiple non-production environments to enable fast and quick development of their applications without worrying about breaking their Production systems. Basis Theory allow you to create these logical separations of data by creating a new Tenant for each environment:

<img src="/assets/images/concepts/tenant_sdlc.png">

### Separating Business Unit data
Many large enterprise and corporate organizations have multiple business units or properties which have different data needs and typically don’t want other parts of the organization to have access to their data. Creating a Tenant for each business unit, enables your organization to allow each to move as quickly as possible and can share access to their data by granting an Application to other units within the organization.

<img src="/assets/images/concepts/tenant_separate_data.png">

## Common Questions

### Can I share a tenant’s tokens between multiple systems?

Yes, you can use different Applications and Permissions to allow your systems to integrate directly with the same Tenant. 
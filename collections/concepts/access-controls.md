---
layout: post
title:  Access Controls
categories: concepts
permalink: /concepts/access-controls/
nav_order: 8
has_children: true
has_toc: false
image:
path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
width: 1200
height: 630
---

# Access Controls

Basis Theory secures sensitive data as [Tokens](/concepts/what-are-tokens) that are stored within an isolated 
compliant environment, called a [Tenant](/concepts/access-controls#what-are-tenants).
Your systems interact with Tokens or Services through the Basis Theory API using an API key that is issued to 
an [Application](/concepts/access-controls#what-are-applications).
Access to your Tenant's data is limited by applying access controls to an Application to ensure services and users
only have access to the data they need.

## What are Tenants?

Everything starts with a Tenant in your Basis Theory account. Tenants represent an isolated environment in which your
[Tokens](/concepts/what-are-tokens) and other resources are defined, managed, and stored.
Data is not shared between Tenants, but you’re allowed to create as many Tenants as you’d like within Basis Theory.
You can use multiple Tenants to isolate different domains of data, and to support your Software Development Life Cycle (SDLC).

### Common Use Cases

#### Software Development Life Cycle Tenants

Companies producing software typically create separate and identical environments to support their development
and release processes. For example, developers and teams create Production environments to house their actual customer 
data and multiple non-Production environments to enable quick development and testing of their applications without 
impacting their Production systems. Basis Theory allows you to create these logical separations of data 
by creating a new Tenant for each environment:

<img src="/assets/images/concepts/tenant_sdlc.png">

#### Separating Business Unit data

Many large enterprise and corporate organizations have multiple business units or properties which have different data needs. 
Some business units may not want other parts of the organization to have direct access to data they own and manage. 
Creating a Tenant for each business unit enables your organization to isolate and limit access to their data by
issuing an Application with limited access controls to other units within the organization.

<img src="/assets/images/concepts/tenant_separate_data.png">

## What are Applications?

An Application represents an external software system or service that will be integrated with the Basis Theory API.
Basis Theory’s Applications are not coupled to a specific implementation type or technology.
Applications could be a native app on a mobile device, a single-page application in a browser, or a backend service
that executes on a server or in a serverless environment.

Applications within Basis Theory have the following properties and characteristics:

### Name

The name of your Application gives you clarity on what context it is being used for, for example, “Acme Billing App” or “Acme Mobile App”.

### Application Type

- **Private**: Used by a backend system or service that runs primarily on a server or in a serverless environment (e.g. NodeJs, .NET, Java, or Ruby). Private Applications allow the broadest access to Token data as the API Key is expected to be kept private and secured within your systems.

- **Public**: Used for Browser, Mobile, or Desktop applications running natively on a device (e.g. iOS, Android, Windows, etc) where the application is collecting data for tokenization via an API call or using Basis Theory Elements. Public Applications have limited permissions available to ensure the API Key can be safely used within publicly available code.

- **Management**: Used with scripts or the Basis Theory Terraform ([request access here](https://basistheory.com/contact)) modules to manage your [Tenant’s](https://developers.basistheory.com/concepts/tenants/) settings and services (Applications, Reactors, Proxy, etc) without logging into our Portal.

### Access Controls

An Application is granted access to your Tenant's resources in one of two ways: by granting the Application a set of 
Permissions, or for more advanced scenarios, by defining one or more Access Rules.

#### Permissions

For basic authorization scenarios, an Application can simply be granted one or more permissions. 
Each Application Type allows a different set of permissions, and you can find a detailed list of all of our 
permissions for all of our Application Types [here](https://docs.basistheory.com/api-reference/#permissions-permission-types).

Token permissions granted to Private or Public applications are applied to all Tokens 
(i.e. they are not scoped to a particular Container of Tokens). In order to ensure sensitive data is not accidentally 
revealed by an application, an implicit [transform](/concepts/access-controls#what-are-access-rules-transform)
is applied for each operation:

| Permission   | Transform |
|--------------|-----------|
| token:create | `mask`    |
| token:update | `mask`    |
| token:read   | `mask`    |
| token:search | `mask`    |
| token:use    | `reveal`  |
| token:delete | N/A       |

This behavior can be customized by defining Access Rules.

#### Access Rules

For more advanced authorization scenarios, Access Rules enable
scoping a set of permissions to a subset of Tokens, and to customize the behavior when returning token data from the API.
Please see the section on [What are Access Rules](/concepts/access-controls#what-are-access-rules) below for more details.

### API Key

Your Application’s API Key is used to authenticate your systems to the Basis Theory platform. 
The API Key can be used to make authenticated requests to our API directly, using Hosted Elements, 
or using the Basis Theory SDK. These API Keys follow a format similar to `key_4qUtg83907AnDem90aJSzcN`.

---

## What are Access Rules?

Access Rules are the building blocks for constructing fine-grained access control policies for an Application.
When performing an operation through the Basis Theory API, Access Rules are evaluated in priority order until 
the first rule is found that matches the operation and target resource(s). Once a matching rule is identified, 
the [transform](/concepts/access-controls#what-are-access-rules-transform) defined on the rule determines
if and how Token data will be returned from the API. If no matching rules are found, 
access to the requested resource is denied with a `403 Forbidden` error.

<span class="base-alert info">
  <span>
    Access Rules are currently only supported on Private and Public Application types, and only control access to 
    Token resources. Access Rules are not supported on Management Applications at this time. 
  </span>
</span>

Access Rules are comprised of the following properties:

### Description

A short description of the rule, only for your own identification purposes.

### Container

Access Rules can be scoped to a specific set of resources using Containers. 
[Containers](/concepts/what-are-token-containers/) are a Token attribute that enables you to logically
organize Tokens into hierarchical paths, similar to a UNIX directory structure. 
Access rules enable you to grant access to a Container of Tokens.

Tokens stored in sub-containers inherit the permissions granted on their parent containers, unless a rule explicitly overrides 
the access controls on a sub-container. For example, having an Access Rule granting `token:read` permission
on the container `/pci/` will allow that Application the ability to read Tokens in the `/pci/low/` and `/pci/high/` containers.

Similarly, if a rule grants `token:read` permission on the `/pci/high/` Container with a `mask` [transform](/concepts/access-controls#what-are-access-rules-transform)
and another rule with lower priority grants `token:read` permission on the `/pci/` Container with a `reveal` transform,
then reading tokens in the `/pci/high/` container will return masked data, 
and reading tokens in the `/pci/low/` container will return plaintext data.

### Permissions

One or more permissions may be granted on the specified Token Container. 
Check out our [API docs](https://docs.basistheory.com/api-reference/#permissions-permission-types) 
for a detailed list of supported permissions by Application type.

### Transform

Transforms are applied to the `data` property of a Token within API responses. The following transforms are supported:

- `redact` - redacts the `data` property from API responses
- `mask` - returns masked data if a `mask` expression is defined on the Token, otherwise data is redacted
- `reveal` - returns the original plaintext data

<span class="base-alert warning">
  <span>
    Be cautious when applying a `reveal` transform while granting the `token:read` permission, 
    as this will make the plaintext data available to your Application, 
    and it may result in your systems being pulled into compliance scope. 
  </span>
</span>

### Priority

Each access rule is assigned a unique priority value controlling the order in which rules are evaluated. 
Rules are evaluated in ascending priority order, with the lowest numerical value having the highest precedence.

---

## Common Use Cases

### Each system accessing Basis Theory

A common use-case for Basis Theory is to grant multiple systems access to the same data or a subset of the data that is being secured in a [Tenant](https://developers.basistheory.com/concepts/tenants/). This could mean that one system is allowed to only collect the data, one system is allowed to view the data, and the last system is only allowed to [Proxy](https://developers.basistheory.com/concepts/what-is-the-proxy/) the data to a 3rd party but never access the raw data.


<img src="/assets/images/concepts/applications_each_system.jpeg">

### Enable partners to use data secured by Basis Theory

Often, businesses need to grant their partners access to their sensitive data — traditionally, these businesses would just export the needed data and send it over to their partner. With Basis Theory Applications, a business creates an Application with permissions restricted to ONLY the data that partner needs. In some cases, businesses will not allow the partner to see the raw data, but rather allow them to [Proxy](https://developers.basistheory.com/concepts/what-is-the-proxy/) the data to another API or run serverless functions with Reactors.


<img src="/assets/images/concepts/applications_partners.jpeg">

### Manage Basis Theory assets with Infrastructure as Code

The Management application type allows the Basis Theory platform to be configured entirely via our API. This enables engineers to write scripts to set up new Applications or Manage your Custom Reactor Formulas all without logging into our Portal UI.

Interested in using IaC (Infrastructure as Code) tooling such as Terraform to configure Basis Theory? [Reach out!](https://basistheory.com/contact)


<img src="/assets/images/concepts/applications_iac.jpeg">

---

## FAQs

### Can I share a Tenant’s Tokens between multiple systems?

Yes, you can use different Applications with unique access controls to allow your systems to integrate with the same Tenant.

### Can I invite other people to join my Tenant?

Yes, new members can be invited to an existing Tenant through the "Members" tab in the [Portal](https://portal.basistheory.com/members).
Managing Tenant Members can also be done directly through the [API](https://docs.basistheory.com/#tenant-members).
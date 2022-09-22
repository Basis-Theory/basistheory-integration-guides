---
layout: post
title:  Applications
categories: concepts
permalink: /concepts/what-are-applications/
nav_order: 3
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# What are Applications?

An Application represents an external software system or component that will be integrated with the Basis Theory API.
Basis Theory’s Applications do not imply any specific implementation type or technology. 
Applications could be a native app on a mobile device, a single-page application in a browser, or a regular web application that executes on a server or in a serverless environment.

## How It Works

Applications within Basis Theory have the following properties and characteristics:

### Name

The name of your Application gives you clarity on what context it is being used for, for example, “Acme Billing App” or “Acme Mobile App”. 

### Application Types

- Private
    - Used with a traditional web application that runs their application logic primarily on a server or in a serverless environment (e.g. NodeJs, .NET, Java, or Ruby). This application type has the most permissions available as the API Key will be private and secured within a server environment.

- Public
    - Used for Browser, Mobile, or Desktop applications running natively on a device (e.g. iOS, Android, Windows, etc) where the application is collecting the data itself and protecting with Basis Theory via an API call or using Basis Theory Elements. Applications created with this type have limited permissions to enable using the API Key in publicly available code.

- Management
    - Used with scripts or the Basis Theory Terraform ([request access here](https://basistheory.com/contact)) modules to configure your [Tenant’s](https://developers.basistheory.com/concepts/tenants/) settings (Applications, Reactors, etc) without logging into our UI Portal.


### Permissions

Each Application Type has different levels of permission available for the application. These permissions range from enabling the ability to Create Tokens, Use Tokens with our Proxy or Reactors, all the way to the ability to create new applications. You can find a detailed list of all of our permissions for all of our Application Types [here](https://docs.basistheory.com/api-reference/#permissions-permission-types).


### API Key

Your Application’s API Key is used to authenticate your systems to the Basis Theory platform. The API Key can be used to make authenticated requests to our API directly, using Hosted Elements, or using the Basis Theory SDK. These API Keys follow a format similar to `key_4qUtg83907AnDem90aJSzcN`.

## Application Templates

To get you quickly started, we provide a set of application templates that cover the most common use cases. Once you are
creating an application, a modal will appear to let you select an application template depending on your needs. If you 
have a particular use case or want to create an application step by step, you can click the `Create Your Own` option. It
is important to note that these templates will only pre-fill the fields in the create application page, and once created,
your application has no relationship with the template in any way.

<img alt="Application Templates" src="/assets/images/concepts/application-templates.png">

In this modal you can see we provide templates for the most common usages such as `Payments`, `Banking` and `PII Data`.
However, we also have the `Starters` section which allows you to create your own application step by step if you have 
a custom use case or want to quickly get started with a `Full Access` application. The last section is `Management`, which 
provides a `Full Management Access` template to quickly get all the managing permissions available.

The `Payments`, `Banking` and `PII` sections all provide four templates each with specific 
[Access Rules](https://developers.basistheory.com/concepts/what-are-access-rules/) for its objective. These four templates
are `Collect (PCI/Bank/PII) Data`, which enables the application to only create or update tokens in the given
[container](https://developers.basistheory.com/concepts/what-are-containers/); `Display (PCI/Bank/PII) Data`, which allows
to read the sensitive raw data stored in tokens; `Use (PCI/Bank/PII) Data`, for applications that need to use tokens 
in a Reactor or Proxy and `Full (PCI/Bank/PII) Data Access`, which gives access to all token operations (create, update, read, use, delete)
within that container.

Remember these templates are more of recommendations that enable you to quickly get started, but you can update the fields
that are pre-filled after selecting them as you like, and if none work for you, you can still create an application
that conforms to your specific needs. 


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
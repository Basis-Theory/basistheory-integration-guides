---
layout: default
title: Manage Applications with Terraform
permalink: /guides/manage-applications-with-terraform/
categories: guides
subcategory: collecting
nav_order: 10
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Manage Applications with Terraform
{: .no_toc }

Terraform is a popular and powerful tool that enables you to version your infrastructure as code. In this guide, we'll walk
you through setting up Terraform to manage your resources within Basis Theory. By the end of this guide, you will have
created an application under your tenant using Terraform, and you will an Application key available for you to use within
your pipeline.

Check out our open source [Terraform provider](https://github.com/Basis-Theory/terraform-provider-basistheory) for more examples and supported resources.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

## Install Terraform

To achieve the following steps, you must have Terraform CLI installed locally or wherever you're planning on running your configuration.
The best guide for installing Terraform can be found in their own website [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).

## Set up Terraform configuration

Let's setup the Terraform configuration you'll need for creating an Application and exporting the Application key we'll need
to interact with other Basis Theory resources.

### Set up the basistheory provider

Firstly, you'll need to configure the `basistheory` provider in a `main.tf` file. The easiest configuration to start with
is to define the API URL and key within the `basistheory` provider.

```terraform
provider "basistheory" {
  api_url        = "https://api.basistheory.com"
  api_key        = "<YOUR_API_KEY_HERE>"
  client_timeout = 5
}
```

Another configuration option is to set the API URL and key through setting `BASISTHEORY_API_URL` and `BASISTHEORY_API_KEY`
environment vars. This leaves you with optionally setting the client timeout, which defaults to 15 seconds. So the most
minimal `main.tf` config can look like this:

```terraform
provider "basistheory" {
}
```

Additionally, you can pin down the version of the Terraform provider you use for the configuration with the following `terraform`
block in the same file:

```terraform
terraform {
  required_providers {
    basistheory = {
      source = "basistheory/basistheory"
      version = "1.0.0"
    }
  }
}
```

### Set up the basistheory_application resource

Typically, resources are set up from the `provider` and `terraform` block. So we'll create an `application.tf` file with
the configuration for our application. Feel free to modify the following configuration for your use case:

```terraform
resource "basistheory_application" "my_application" {
  name = "My Application"
  type = "server_to_server"
  permissions = [
    "token:general:create",
    "token:general:read:low",
    "token:pci:create",
    "token:pci:read:low",
  ]
}
```

### Set up the output for your application key

```terraform
output "my_application_key" {
  value       = basistheory_application.my_application.key
  description = "My application key"
  sensitive   = true
}
```

## Executing Terraform

## Application key output use

## Using Terraform to manage Reactors and more

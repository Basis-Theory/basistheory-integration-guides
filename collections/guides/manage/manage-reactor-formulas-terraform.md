---
layout: default
title: Manage Reactor Formulas with Terraform
permalink: /guides/manage-reactor-formulas-with-terraform/
categories: guides
subcategory: manage
nav_order: 2
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Manage Reactor Formulas with Terraform
{: .no_toc }

Terraform is a popular and powerful tool that enables you to version your infrastructure as code. In this guide, we'll walk
you through setting up Terraform to manage your resources locally within Basis Theory. By the end of this guide, you will have
created a Reactor Formula under your Tenant using Terraform.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

<span class="base-alert warning">
  <span>
    To start, you'll need a new <code>Management</code> [Application](https://docs.basistheory.com/api-reference/#applications) with <code>reactor:create</code>, <code>reactor:read</code>, <code>reactor:update</code>, and <code>reactor:delete</code> permissions. <a href="https://portal.basistheory.com/applications/create?name=Terraform+Application&type=management&permissions=reactor%3Acreate&permissions=reactor%3Aread&permissions=reactor%3Aupdate&permissions=reactor%3Adelete" target="_blank">Click here to create one.</a>
  </span>
</span>

<span class="base-alert warning">
  <span>
    Creating custom Reactor Formulas is currently in Private Beta. If you would like to be added to the beta program, please submit an <a href="https://support.basistheory.com/hc/requests/new?tf_subject=Join%20Beta%20Program%20to%20Code%20Your%20Own%20Reactor&amp;tf_description=Let%20us%20know%20what%20you%27d%20like%20to%20do%20with%20your%20Reactor&amp;tf_priority=normal" target="_blank">access request</a>!
  </span>
</span>

## Install Terraform

To achieve the following steps, you must have the Terraform CLI installed locally or wherever you're planning on running your configuration.
The best guide for installing Terraform can be found on their own website [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).

## Set up Terraform configuration

Let's set up the Terraform configuration you'll need for creating a Reactor Formula.

### Set up the basistheory provider

Firstly, you'll need to configure the `terraform` and `provider` configuration blocks in a `main.tf` file. Let's add the configuration for the provider source and provider configuration.
You can find the latest versions available and other configuration options in the provider documentation [here](https://registry.terraform.io/providers/Basis-Theory/basistheory).

```terraform
terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.1.3"
    }
  }
}

provider "basistheory" {
  api_key = "<YOUR_API_KEY_HERE>"
}
```

### Set up the basistheory_reactor_formula resource

Typically, resources are set up in a different file outside of `main.tf`. Let's create a new `reactor_formula.tf`
file with the following configuration for our Reactor Formula. Feel free to modify the following configuration for your use case:

<span class="base-alert info">
  <span>
    For more information about writing your own code for a Reactor Formula, check out [our guide](/guides/run-your-own-code-in-a-reactor/).
  </span>
</span>

```terraform
resource "basistheory_reactor_formula" "my_awesome_formula" {
  name        = "My Awesome Reactor Formula"
  description = "Do something awesome!"
  type        = "private"
  icon        = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  code        = <<-EOT
  module.exports = async function (req) {
    // Do something with `req.configuration.SERVICE_API_KEY`

    // Do anything here!

    return {
      raw: {
        foo: "bar"
      },
      tokenize: {}
    };
  };
  EOT

  configuration {
    name        = "SERVICE_API_KEY"
    description = "Configuration description"
    type        = "string"
  }

  request_parameter {
    name        = "request_parameter_1"
    description = "Request parameter description"
    type        = "string"
  }

  request_parameter {
    name        = "request_parameter_2"
    description = "Request parameter description"
    type        = "boolean"
    optional    = true
  }
}
```

### Set up a basistheory_reactor resource from the Reactor Formula

Next, we can create and configure a Reactor referencing the Reactor Formula ID of `basistheory_reactor_formula.my_awesome_formula.id`.
Let's create a new `reactor.tf` file with the following configuration for our Reactor Formula.
Feel free to modify the following configuration for your use case:

```terraform
variable "service_api_key" {
  type      = string
  sensitive = true
  default   = "foo"
}

resource "basistheory_reactor" "my_awesome_reactor" {
  name          = "My Awesome Reactor"
  formula_id    = basistheory_reactor_formula.my_awesome_formula.id
  configuration = {
    SERVICE_API_KEY = var.service_api_key # default value can be overridden by setting TF_VAR_service_api_key environment variable
  }
}
```

## Executing Terraform

Now that our configuration is set up, it's time to execute Terraform commands to create these resources within your Basis Theory Tenant.

The first step in managing any resources via Terraform, is to initialize your directory with your configuration. There are
many things that occur when initializing Terraform, one of which is downloading the `basistheory` provider from the public
Terraform registry. Let's run the following `terraform` commands within the same directory containing your configuration.

```bash
terraform init
```

A prudent step to ensure you have a valid configuration is to run `basistheory`'s provider validations against your current
configuration. This command uses local resources to validate against the downloaded provider and does not talk to any remote
resources. If your configuration is valid the command prints out `Success! The configuration is valid.`.

```bash
terraform validate
```

Finally, you can apply the configuration using the `apply` command. `apply` will output a plan Terraform intends to execute
and waits for your confirmation. This plan contains differences between your current configuration and your current Terraform state.
After reviewing the plan, type `yes` to create your Reactor Formula and Reactor within Basis Theory.

```bash
terraform apply
```

If all was successful, Terraform should output that 2 resources were successfully created. If you made it this far, pat yourself
on the back! 🎉 You've successfully created a Reactor Formula and configured a Reactor via Terraform! 
To find these new resources in the Basis Theory Portal, select the appropriate Tenant and then check out the available
[Reactor Formulas](https://portal.basistheory.com/reactors/formulas) and [Reactors](https://portal.basistheory.com/reactors).

## Using Terraform to manage other Basis Theory resources

If you'd like to manage other Basis Theory resources via Terraform, take a look at the other docs we've made available in
the [Terraform provider docs](https://registry.terraform.io/providers/Basis-Theory/basistheory/latest/docs).

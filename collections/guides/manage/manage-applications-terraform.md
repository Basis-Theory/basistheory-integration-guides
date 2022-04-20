---
layout: default
title: Manage Applications with Terraform
permalink: /guides/manage-applications-with-terraform/
categories: guides
subcategory: manage
nav_order: 1
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
you through setting up Terraform to manage your resources locally within Basis Theory. By the end of this guide, you will have
created an Application under your tenant using Terraform, and you will have an Application key available for you to use.

### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}

<span class="base-alert warning">
  <span>
    To start, you'll need a new <code>Management</code> [Application](https://docs.basistheory.com/api-reference/#applications) with <code>application:create</code>, <code>application:read</code>, <code>application:update</code>, and <code>application:delete</code> permissions. <a href="https://portal.basistheory.com/applications/create?name=Terraform+Application&permissions=application%3Acreate&permissions=application%3Aread&permissions=application%3Aupdate&permissions=application%3Adelete&type=management" target="_blank">Click here to create one.</a>
  </span>
</span>

## Install Terraform

To achieve the following steps, you must have Terraform CLI installed locally or wherever you're planning on running your configuration.
The best guide for installing Terraform can be found on their own website [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).

## Set up Terraform configuration

Let's setup the Terraform configuration you'll need for creating an Application and exporting the Application key you'll
need to interact with other Basis Theory resources.

### Set up the basistheory provider

Firstly, you'll need to configure the `terraform` configuration block in a `main.tf` file. Let's add a source for where
to pull down our Terraform provider, and pin the version as well. View the latest version available [here](https://registry.terraform.io/providers/Basis-Theory/basistheory).

```terraform
terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.1.3"
    }
  }
}
```

Now you'll need to define some details for the provider. To start with you can define the API URL, API key, and client timeout
within the `basistheory` provider.

```terraform
provider "basistheory" {
  api_url        = "https://api.basistheory.com"
  api_key        = "<YOUR_API_KEY_HERE>"
  client_timeout = 5
}
```

Another configuration option is to just set the API key through setting a `BASISTHEORY_API_KEY` environment variable. This
leaves you with optionally setting the API URL and client timeout through `BASISTHEORY_API_URL` and `BASISTHEORY_CLIENT_TIMEOUT`
environment variables, respectively. These don't need to be explicitly set since the API URL defaults to `https://api.basistheory.com`
and the client timeout defaults to 15 seconds. So the most minimal `main.tf` file can look like this:

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
}
```

### Set up the basistheory_application resource

Typically, resources are set up in a different file from the `provider` and `terraform` block. So let's create an `application.tf`
file with the configuration for our Application. Feel free to modify the following configuration for your use case:

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

### Set up the output for your Application key

To make use of the Application you create, you'll need to extract the key. Defining `output` blocks make data about your
resources available for use within the command line. Define the `ouput` block in a new `output.tf` file with the contents
below:

```terraform
output "my_application_key" {
  value       = basistheory_application.my_application.key
  description = "My Application key"
  sensitive   = true
}
```

## Executing Terraform

Now that our configuration is set up, it's time to execute Terraform commands to get these resources created.

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
After reviewing the plan, type `yes` to create your Application within Basis Theory.

```bash
terraform apply
```

If all was successful, Terraform should output that 1 resource was successfully added. If you made it this far, pat yourself
on the back! 🎉 You've successfully created an Application via Terraform! You can view your new application within the [portal](https://portal.basistheory/applications).

Now in order to use the Application API Key for `curl` commands, for example, you'll need to export the key that was just
created. You can do this by executing the `output` command below:

<span class="base-alert warning">
  <span>
    The following command will print the sensitive Application key to the terminal.
  </span>
</span>

```bash
terraform output -raw my_application_key
```

You can follow our [quickstart with curl](https://developers.basistheory.com/getting-started/quickstart-with-curl/) guide
and skip to step 3 to create tokens with your Application API key output. 

## Using Terraform to manage Reactors and more

If you'd like to manage other Basis Theory resources via Terraform, take a look at the other docs we've made available in
the [Terraform provider docs](https://registry.terraform.io/providers/Basis-Theory/basistheory/latest/docs).

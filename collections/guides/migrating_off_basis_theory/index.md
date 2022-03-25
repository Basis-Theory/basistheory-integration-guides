---
layout: default
title: Migrating off Basis Theory
permalink: /guides/migrating-off-basis-theory/
categories: guides
subcategory: processing
nav_order: 7
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Migrating off Basis Theory
{: .no_toc }

We know business goals and technical needs change over time. We get it. More importantly, we want to make sure you have what you need to move off of Basis Theory and just as quickly as we’ve helped you safely build your products and protect your data. This guide will walk you through moving your PCI compliant data to another compliant service provider and options to move all of your non-PCI data into your database or another vault.

If you need help with your migration plan - [please reach out](https://basistheory.com/contact).

<span class="base-alert warning">
  <span>
    <b>Warning: Moving your compliant data</b><br/>
    Before migrating data out of Basis Theory’s systems, you should confirm that the desired location meets all requirements for the underlying data type. For example, moving your card data off of Basis Theory will require you or your new provider to be Payments Card Institute (PCI) Level 1 compliant. 
  </span>
</span>


## Step 1: Create a full-access Basis Theory Application

To move all of your data quickly, you’ll want to create a Server-to-Server Application with all permissions within the Tenant you’re looking to migrate. Keep in mind this Application will have the highest level of access to your data, so you’ll want to secure the API Key with the highest level of security possible as you migrate.

[Click here to create an Application with all permissions.](https://portal.basistheory.com/applications/create?backRoute=getting-started&name=Migration+Application&permissions=token%3Abank%3Acreate&permissions=token%3Abank%3Aread%3Ahigh&permissions=token%3Abank%3Aupdate&permissions=token%3Abank%3Ause%3Aproxy&permissions=token%3Abank%3Ause%3Areactor&permissions=token%3Abank%3Adelete&permissions=token%3Ageneral%3Acreate&permissions=token%3Ageneral%3Aread%3Ahigh&permissions=token%3Ageneral%3Ause%3Aproxy&permissions=token%3Ageneral%3Ause%3Areactor&permissions=token%3Ageneral%3Adelete&permissions=token%3Apci%3Acreate&permissions=token%3Apci%3Aupdate&permissions=token%3Apci%3Ause%3Aproxy&permissions=token%3Apci%3Ause%3Areactor&permissions=token%3Apci%3Adelete&permissions=token%3Apii%3Acreate&permissions=token%3Apii%3Aread%3Ahigh&permissions=token%3Apii%3Ause%3Aproxy&permissions=token%3Apii%3Ause%3Areactor&permissions=token%3Apii%3Adelete&permissions=token%3Apci%3Aread%3Amoderate&type=server_to_server)

## Step 2: Choose a method to migrate data out of Basis Theory

There are three recommended ways to migrate your existing Basis Theory data to a new location.

1. Proxy
2. Export
3. Reactor

Read each section carefully, as certain methods may not be ideal for certain types of data or situations.

### 1. Proxy

Using our Proxy is the simplest path to migrating your data to another API-based service provider. Proxy enables you to forward your tokens to a new provider without the plaintext data touching your systems.

The following example provides a pattern for proxying your plaintext data to a new provider and storing your new provider's identifiers in your database. _The array of tokens is an example of data you’ve stored in your database - replace this by querying your database._

```js
import axios from 'axios';
import { BasisTheory } from '@basis-theory/basis-theory-js';

async function migration() {
    const bt = await new BasisTheory().init('key_here');

    const rowsFromDatabase = [
        {name: "test", ssn: "fc88408b-d031-49c6-abd9-9e53589a6091"},
        {name: "test", ssn: "c35f271e-0338-45fb-a036-c36a0e290ab7"},
        // .. more rows of data 
    ];

    rowsFromDatabase.forEach(async (row, i) => {
        const token = await axios.post('<https://api.basistheory.com/proxy>',
            {
                "value": {{${row.ssn}}},
        "format": "UUID"
    },
        {headers: {
            'BT-PROXY-URL': '<https://api.new.provider/secure>',
                'BT-API-KEY': 'key_here',
        }
        };

        rowsFromDatabase[i].ssn = token.aliases[0].alias;
    });

    //save rowsFromDatabase to save the raw values back into your database
}
```

### 2. Export all of your data

<span class="base-alert warning">
  <span>
    <b>WARNING:</b> For Card data (PCI), you can only export if you are PCI Level 1 compliant and have submitted your Report on Compliance to Basis Theory. Please [reach out](https://basistheory.com/contact) for help submitting your ROC. If you’re looking to move to another PCI Level 1 provider, please view our Proxy or Reactor solution. 
  </span>
</span>

Depending on your situation, you may want to export your data directly into your database instead of moving directly to a new Tokenization provider. When you do this, you’ll want to consider encrypting the data you’re exporting to keep the security of your data at the same level Basis Theory has provided you.

The following example shows how you can use the [Retrieve a Token](https://docs.basistheory.com/#tokens-get-a-token) endpoint to pull back tokens you have stored within your database. _The array of tokens is an example of data you’ve stored in your database - replace this by querying your database._

```js
import { BasisTheory } from '@basis-theory/basis-theory-js';

async function migration() {
  const bt = await new BasisTheory().init('key_here');

	const rowsFromDatabase = [
		{name: "test", ssn: "fc88408b-d031-49c6-abd9-9e53589a6091"},
		{name: "test", ssn: "c35f271e-0338-45fb-a036-c36a0e290ab7"},
		// .. more rows of data 
	];

	rowsFromDatabase.forEach(async (row, i) => {
		const token = await bt.tokens.retrieve(row.ssn);
		rowsFromDatabase[i].ssn = token.data;
	});

	//save rowsFromDatabase to save the raw values back into your database
}
```

### 3. Reactors to move your data to a new provider

If the above two examples don’t provide the flexibility you’re needing as you switch providers, you can take advantage of our [Reactors](https://docs.basistheory.com/api-reference/#reactors). Reactors are serverless compute services allowing Node.js code (Reactor Formula) hosted in Basis Theory to be executed against your tokens completely isolated away from your existing application and systems.
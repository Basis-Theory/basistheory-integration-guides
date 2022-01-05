---
layout: default
title: Own Your Encryption Keys
permalink: /guides/own-your-encryption-keys/
categories: guides
nav_order: 3
has_children: true
has_toc: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

# Own Your Encryption Keys
{: .no_toc }

A huge benefit of the Basis Theory platform is controlling your data the way you see fit. This guide will show you how to start encrypting data within your applications, so only you can see the data. If you'd like to dive right into the code, feel free to clone our [Basis Theory Sample App](https://github.com/Basis-Theory/basistheory-sample-app-dotnet).

This example only supports tokenizing data today, and will soon enable you to also use our Reactor platform in a safe and secure manner without Basis Theory having ongoing access to your data. If you'd like to use our Reactors with your own encryption, [we'd love to chat.](https://discord.gg/NSvXxaW5Fv)

Our SDKs support multiple ways to manage your own encryption and those encryption keys, for this example we will be using our [Basis Theory .NET SDK](https://github.com/Basis-Theory/basistheory-dotnet) and showing how you can encrypt data using simple key pairs.


### Table of contents
{: .no_toc .text-delta }
1. 
{:toc}


## Set Up Your Encryption Key

All Basis Theory SDKs support key management. In order to utilize this feature, you need to set up a Provider Key Factory and register it with the Provider Key Service. This allows you to register multiple key management solutions and use them interchangeably in your application.

For this example, we will set up a simple, in-memory RSA key factory and register it with our Provider Key Service.

```csharp
public class RSAKeyProvider : IProviderKeyFactory
{
    public string Provider => "MEMORY";
    public string Algorithm => "RSA";

    private static readonly ConcurrentDictionary<string, ProviderEncryptionKey> EncryptionKeys =
        new ConcurrentDictionary<string, ProviderEncryptionKey>();

    /*
     * Get or create a key with your KMS of choice. This example uses an in-memory RSA key.
     * It is recommended the KeyId is a unique identifier for the ProviderEncryptionKey and 
     * the ProviderKeyId is the unique identifier of the key in the KMS.
     */
    public Task<ProviderEncryptionKey> GetOrCreateKeyAsync(string name, 
        CancellationToken cancellationToken = default) =>
        Task.FromResult(EncryptionKeys.GetOrAdd(name, n =>
        {
            var rsa = RSA.Create(4096);

            return new ProviderEncryptionKey
            {
                KeyId = n,
                Name = n,
                ProviderKeyId = 
                    $"{Convert.ToBase64String(rsa.ExportRSAPublicKey())}.{Convert.ToBase64String(rsa.ExportRSAPrivateKey())}",
                Provider = Provider,
                Algorithm = Algorithm
            };
          }));

    /*
     * Retrieve a provider key given the KeyId which was populated by the GetOrCreateKeyAsync method.
     */
    public Task<ProviderEncryptionKey> GetKeyByKeyIdAsync(string keyId, 
        CancellationToken cancellationToken = default) =>
        EncryptionKeys.TryGetValue(keyId, out var key) ?
            Task.FromResult(key) :
            Task.FromResult<ProviderEncryptionKey>(null);
}

var providerKeyService = new ProviderKeyService(new CachingService(), new List<IProviderKeyFactory>
{
    new RSAKeyProvider()
});

var providerEncryptionKey = await providerKeyService.GetOrCreateKeyAsync("test", "MEMORY", "RSA");
```

The Provider Key Service returns a Provider Encryption Key with the following properties:

Attribute | Description
--------- | -----------
`Name`    | The name of the Provider Encryption Key
`Key ID`  | The unique identifier of the Provider Encryption Key. This could be the name of the key, a UUID, or a KMS provider identifier. The Encryption Service will use this as the `key` property on the `key encryption key`
`Provider Key ID` | The identifier the provider users to lookup the key. This could be a KMS identifier, a filename, or a database primary key. For this example, we are just setting the Provider Key ID as the RSA encryption key
`Provider` | The provider which generated the Provider Encryption Key
`Algorithm` | The algorithm to be used for encryption


## Encrypt Your Data

Now that we have generated an encryption key, we need to actually encrypt the data. The Encryption Service can be used independently of the Provider Key Service. If you want to construct a Provider Encryption Key and pass it to the Encryption Service, it will still work as long as all required properties of the Provider Encryption Key are populated.

In order to utilize the Encryption Service, you need to set up an Encryption Factory and register it with the Encryption Service. This allows you to register multiple encryption solutions to encrypt and decrypt your data with your services of choice.

We will set up a simple Encryption Factory which will deserialize and read the RSA key we wrote to the Provider Key ID in the previous step.

```csharp
public class RSAEncryptionFactory : IEncryptionFactory
{
    public string Provider => "MEMORY";
    public string Algorithm => "RSA";

    /*
     * Encrypt the provided plaintext with the key associated with the provider key ID. This is typically a call to the KMS provider calling an encrypt method.
     */
    public Task<string> EncryptAsync(string providerKeyId, string plaintext, CancellationToken cancellationToken = default)
    {
        using var rsa = RSA.Create();

        var publicKey = Convert.FromBase64String(providerKeyId.Split(".")[0]);
        rsa.ImportRSAPublicKey(publicKey, out var _);

        var cipherText = rsa.Encrypt(Encoding.UTF8.GetBytes(plaintext), RSAEncryptionPadding.Pkcs1);

        return Task.FromResult(Convert.ToBase64String(cipherText));
    }

    /*
     * Decrypt the provided ciphtertext with the key associated with the provider key ID. This is typically a call to the KMS provider calling a decrypt method.
     */
    public Task<string> DecryptAsync(string providerKeyId, string ciphertext, CancellationToken cancellationToken = default)
    {
        using var rsa = RSA.Create();

        var privateKey = Convert.FromBase64String(providerKeyId.Split(".")[1]);
        rsa.ImportRSAPrivateKey(privateKey, out var _);

        var plaintext = rsa.Decrypt(Convert.FromBase64String(ciphertext), RSAEncryptionPadding.Pkcs1);

        return Task.FromResult(Encoding.UTF8.GetString(plaintext));
    }
}

/* 
 * The Encryption Service allows you to register several Encryption Factories to be able to connect to 
 * your KMS and encrypt/decrypt data with the provided provider key ID.
 * The Encryption Service will encrypt the plaintext with a per-use AES-256 encryption key, and then encrypt
 * the AES key with a provider encryption key.
 */
var encryptionService = new EncryptionService(new List<IEncryptionFactory>
{
    new RSAEncryptionFactory()
});

const string toEncrypt = "Hello World!";

var encryptedData = await encryptionService.EncryptAsync(toEncrypt, providerEncryptionKey);
```

## Configure the SDK

Now that we have encrypted the data, we want to configure the SDK to be able to store the encrypted data with Basis Theory.

```csharp
// Create the TokenClient providing your API Key which has token:general:create and token:general:read:high permissions
var tokenClient = new TokenClient("<REPLACE WITH API KEY>");
```

## Tokenize Your Data

Next we need to take the encrypted data and convert it to a token. There is a helper method to make this simple. We then pass that encrypted token to Basis Theory.

```csharp
// Map the encrypted data to a new token to be stored
var token = new Token
{
    Data = encryptedData.CipherText,
    Encryption = encryptedData.ToEncryptionMetadata()
};

// Call the Basis Theory token vault passing the encrypted token
var response = await tokenClient.CreateAsync(token);
```

## Retrieve Your Token

Next, we can optionally fetch the token back from Basis Theory. This will return the encrypted `data` field and the `encryption` metadata which will have all the information needed to decrypt your token.

```csharp
// Retrieve back the token by ID
var retrievedToken = await tokenClient.GetByIdAsync(response.Id);
```

## Decrypt Your Token

Now that we have retrieved the encrypted token back from Basis Theory, we can use our Encryption Service we configured earlier to decrypt the data using the `key` and `alg` field of the `kek` to retrieve our Provider Encryption Key from the Provider Key Service. We can pass the Provider Encryption Key to the Encryption Service to decrypt the data.

```csharp
// Fetch the Provider Encryption Key to decrypt the token
var keyToDecrypt = await providerKeyService.GetKeyByKeyIdAsync(retrievedToken.Encryption.KeyEncryptionKey);
		
// Decrypt the ciphertext with the encrypted data from the token and the provider encryption key
// used to originally to encrypt
var plaintext = await encryptionService.DecryptAsync(retrievedToken.ToEncryptedData(), keyToDecrypt);
```

## See it in action
{: .no_toc }

Want to play with this guide? [Check it out here.](https://dotnetfiddle.net/jzMcnU)

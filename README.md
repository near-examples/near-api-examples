# near-api-examples

This repository contains examples of how to use the NEAR API in both JavaScript and Rust. These examples are referenced in the NEAR documentation.

## Setup

To run the examples, you need to set up the environment variables. In the root of the repository, create a `.env` file with the following variables:

```.env
ACCOUNT_ID=near-api-tester.testnet // The account ID to use for the examples
PRIVATE_KEY=ed25519:5gUStfPd... // The private key for the account
SEED_PHRASE="goose card december immune flag ..." // The seed phrase for the account
```

These can be created using the [NEAR CLI](https://github.com/near/near-cli-rs)

```bash
near account create-account sponsor-by-faucet-service <accountId> autogenerate-new-keypair print-to-terminal network-config testnet create
```

For some of the examples, you should also set up a file named `credentials-file.json` in the root of the repository. This file needs to contain a `private_key` and `public_key` field with a valid private key and public key for the account in the `.env` file.

```json
{
  "private_key": "ed25519:5gUStfPd...",
  "public_key": "ed25519:EPcy3E2U..."
}
```

# Running the examples

## JavaScript

Enter the `javascript` directory and install the dependencies:

```bash
cd javascript
npm install
```

Then run the example you want to run (replace `example-name` with the name of the example you want to run):

```bash
npm run example-name
```

Running credentials-directory.js requires the user to have saved their credentials to the legacy key store via the NEAR CLI.

```bash
near account import-account using-private-key <privateKey> network-config testnet
```

## Rust

The Rust examples are located in the `rust` directory.

Enter the Rust directory.

```bash
cd rust
```

Run the example you want to run (replace `example_name` with the name of the example you want to run):

```bash
cargo run --example example_name
```

Running keystore.rs and credentials-directory.rs requires the user to have saved their credentials to the keychain and legacy key store, respectively, via the NEAR CLI.

```bash
near account import-account using-private-key <privateKey> network-config testnet
```

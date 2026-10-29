# near-api-examples

This repository contains examples of how to use the NEAR API in JavaScript, Rust and Python. These examples are referenced in the NEAR documentation.

## Setup

Use Node.js **22.22.2 or newer** (CI uses Node.js 24). Rust examples use **Rust 1.96**, selected by the toolchain files in `near-api-rs/` and `near-kit-rs/`.

To run the examples, you need to set up the environment variables. In the root of the repository, create a `.env` file with the following variables:

```.env
ACCOUNT_ID=near-api-tester.testnet # The account ID to use for the examples
PRIVATE_KEY=ed25519:5gUStfPd... # The private key for the account
SEED_PHRASE="goose card december immune flag ..." # The seed phrase for the account
FASTNEAR_API_KEY=your_api_key_here # (Optional) FastNear RPC API key for authenticated requests
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

Enter the `near-api-js` directory and install the dependencies:

```bash
cd near-api-js
npm ci
```

Then run the example you want to run (replace `example-name` with the name of the example you want to run):

```bash
npm run example-name
```

For a complete meta-transaction client and HTTP relayer using near-api-js 7, see [the meta-tx example](near-api-js/examples/meta-tx/README.md).

Running credentials-directory.js requires the user to have saved their credentials to the legacy key store via the NEAR CLI.

```bash
near account import-account using-private-key <privateKey> network-config testnet
```

## near-kit

The equivalent JavaScript examples use near-kit 0.20. From the repository root:

```bash
cd near-kit
npm ci
npm run check
npm run example-name
```

Run JavaScript commands from the selected package directory. Both packages load the shared `../.env` described above; the meta-transaction client/server instead use the package-local configuration described in their README. near-kit validates serialized private keys with `parseKey` before configuring the client. Its credential-file example reads the shared `credentials-file.json` from the repository root.

## Rust

The `near-api-rs` examples are located in the `near-api-rs` directory.

Enter the Rust directory.

```bash
cd near-api-rs
```

Run the example you want to run (replace `example_name` with the name of the example you want to run):

```bash
cargo run --example example_name
```

Running keystore.rs and credentials-directory.rs requires the user to have saved their credentials to the keychain and legacy key store, respectively, via the NEAR CLI. The same applies to the `near-kit-rs/examples/signer_options` examples.

```bash
near account import-account using-private-key <privateKey> network-config testnet
```

## near-kit (Rust)

The `near-kit` Rust examples are located in the `near-kit-rs` directory.

```bash
cd near-kit-rs
cargo run --example example_name
```

## near-kit (Python)

The `near-kit` Python examples are located in the `near-kit-py` directory. They need Python 3.11+ and [uv](https://docs.astral.sh/uv/getting-started/installation/).

```bash
cd near-kit-py
uv sync --frozen
uv run --frozen python examples/example_name.py
```

## NEP-413 signature verification

The [Rust](near-kit-rs/examples/verify_signature.rs) and [Python](near-kit-py/examples/verify_signature.py) examples sign a message locally, then verify the signature and that its key has full-access permission on the claimed testnet account. Set `ACCOUNT_ID` and `PRIVATE_KEY` in the shared `.env` to an existing testnet account and one of its full-access ed25519 keys. These examples only sign off-chain messages and read account keys; they do not submit transactions.

From `near-kit-rs`, run `cargo run --locked --example verify_signature`. From `near-kit-py`, run `uv run --frozen python examples/verify_signature.py`.

In a web application, get the signed response from the wallet's `signMessage` method instead of signing on the verification service. Verify against the original challenge stored by the service, including the message, recipient, and nonce, and reject reused challenges. The examples use `generate_nonce`, whose timestamp is checked by near-kit. They use no callback URL; if your challenge includes one, include it in verification too.

## Post-quantum keys (ML-DSA-65)

Runnable examples are available in [JavaScript](near-kit/examples/post-quantum-keys.js), [Rust](near-kit-rs/examples/post_quantum_keys.rs), and [Python](near-kit-py/examples/post_quantum_keys.py). Each uses the existing full-access key from `ACCOUNT_ID` and `PRIVATE_KEY` in the shared `.env` to register a temporary ML-DSA-65 full-access key on testnet, waits for registration to finalize, then uses it to sign a self-transfer. The original signer removes the temporary key afterward, including when the self-transfer fails.

Run from the corresponding package directory:

- JavaScript (`near-kit`): `npm run post-quantum-keys`
- Rust (`near-kit-rs`): `cargo run --locked --example post_quantum_keys`
- Python (`near-kit-py`): `uv run --frozen python examples/post_quantum_keys.py`

Running these examples submits transactions and pays testnet gas and temporary key storage costs. The post-quantum private key stays in memory and is not printed or saved. On-chain key listings represent ML-DSA-65 keys by their `ml-dsa-65-hash:` handles; these identify registered keys and are not full public keys for signing or registration.

## Checking changes

Typechecking and compiling the examples do not require accounts, credentials, or a running network:

```bash
(cd near-api-js && npm ci && npm run check)
(cd near-kit && npm ci && npm run check)
(cd near-api-rs && cargo fmt --all --check && cargo check --locked --examples)
(cd near-kit-rs && cargo fmt --all --check && cargo check --locked --examples)
(cd near-kit-py && uv sync --frozen && uv run --frozen python -m compileall -q examples)
```

The `near-api-rs` examples use the key, action, gas and token types re-exported by near-api 0.8.6. The `near-kit-rs` examples use near-kit 0.19. The `keystore` feature is enabled for the system-keychain signer example. Committed lockfiles reproduce the dependency sets checked in CI.

Running individual examples is separate from checking them: many examples create accounts, change access keys, deploy contracts or transfer tokens on testnet. Configure their account IDs and credentials before running them.

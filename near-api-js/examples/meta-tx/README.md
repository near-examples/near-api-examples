# Meta-transaction client and relayer

This example uses near-api-js 7.4+ and extends [`../meta.ts`](../meta.ts) into two Node.js processes. The client signs a delegate action using `Account.createSignedMetaTransaction` and sends its Borsh encoding over HTTP. The server decodes it and calls `Account.relayMetaTransaction` using a funded relayer account. The relayer pays transaction gas; the client keeps its private key and authorizes the contract call.

The example calls `set_greeting` on `hello.near-examples.testnet` with zero attached deposit. The server sponsors only one configured sender, contract, and method, with a maximum of 10 Tgas. Both processes use the same RPC network.

## Setup

Use Node.js 20.19+ (or Node.js 22.12+) and install dependencies from `near-api-js/`:

```bash
cd near-api-js
npm install
```

Prepare two existing testnet accounts and their Ed25519 private keys:

- A **relayer** account with a full-access key and enough NEAR to pay transaction gas.
- A **client** account with a key already registered on-chain. This example uses a full-access key for local signing. The account must exist and cover its storage requirements, but it does not pay transaction gas for the delegated call.

You can create testnet accounts with the [NEAR CLI](https://github.com/near/near-cli-rs):

```bash
near account create-account sponsor-by-faucet-service <account-id> \
  autogenerate-new-keypair print-to-terminal network-config testnet create
```

Run that command once for each account with a different account ID. Keep the printed keys private. This setup uses existing accounts; neither the client nor server creates accounts automatically.

Copy the separate configuration files:

```bash
cp examples/meta-tx/.env.server.example examples/meta-tx/.env.server
cp examples/meta-tx/.env.client.example examples/meta-tx/.env.client
```

Edit them with your account IDs and keys. Set `ALLOWED_SENDER_ID` on the server to the client's `CLIENT_ID`. Generate a shared token, for example with `openssl rand -hex 32`, and set `RELAYER_TOKEN` to that same value in both files. Set `CONTRACT_ID` and `RPC_URL` consistently in both files if you change them.

The server loads only `.env.server`, and the client loads only `.env.client`. Both files are ignored by Git. Environment variables already set in the process take precedence. Run the npm commands from `near-api-js/` so these paths resolve correctly.

## Run

Start the relayer:

```bash
npm run meta-tx:server
```

In another terminal, send the greeting:

```bash
npm run meta-tx:client
```

The client prints the relayed transaction outcome, including its hash. You can use the hash to inspect the transaction in a testnet explorer. To read back the greeting with NEAR CLI:

```bash
near contract call-function as-read-only hello.near-examples.testnet get_greeting \
  json-args '{}' network-config testnet now
```

`GREETING` changes the message. `PORT` changes the server port; update the client's `RELAYER_URL` to match.

## Request flow

1. The client queries its access-key nonce and the current block height, then signs one `set_greeting` call locally with an expiry of 120 blocks.
2. `encodeSignedDelegate` produces Borsh bytes. The client base64-encodes them into a JSON object, avoiding JSON serialization of `bigint` values in the delegate itself.
3. The client posts the object to `/relay` with the shared token:

   ```json
   { "signedDelegate": "<base64-encoded Borsh bytes>" }
   ```

4. The server uses `deserialize(SCHEMA.SignedDelegate, bytes)` from Borsh 2, checks the sender, receiver, action count, method, gas, and zero deposit, and submits the delegate with `relayer.relayMetaTransaction(signedDelegate)`. This SDK method addresses the outer transaction to the delegate's **sender** and wraps the signed delegate in an action.
5. NEAR verifies the client's signature, key permissions, nonce, and expiry. The relayer returns `{ "outcome": ... }` as JSON. Any `bigint` fields in the response become decimal strings.

The client's private key is never sent to the relayer, and the server never needs it. A nonzero attached deposit or transfer in a delegate would spend the sender's funds; this example's policy rejects those actions.

## Errors and concurrency

The endpoint returns `400` for invalid JSON/base64/Borsh, `401` for an invalid token, `403` for calls outside the sponsorship policy, `413` for bodies over 16 KiB, and `415` for an unsupported content type. It accepts only `POST /relay`.

A failed submission returns `502`. A timeout or RPC failure can happen after a transaction was accepted, so check on-chain before retrying. The client does not automatically retry. Concurrent delegates signed by the same client key may use the same nonce; wait for one call to finish before signing the next. Expired or stale delegates must be signed again.

The server serializes submissions to prevent nonce races on its single relayer key. This queue is local to one process; do not share that key across multiple running relayers without coordinating nonces.

The server binds to `127.0.0.1` and the client is a Node.js script. For deployment, put the endpoint behind HTTPS, add per-user authentication and rate limits, manage the relayer's spending budget, and validate signatures and expiry before paying to submit them. The shared token is for this local example and must stay in trusted processes. A browser client needs an appropriate authentication flow and CORS configuration. Wallet integration requires a signer that supports delegate actions; ordinary transaction signing or NEP-413 message signing is not interchangeable with delegate-action signing.

## Test

From `near-api-js/`:

```bash
npm run meta-tx:test
npx tsc --noEmit
```

The tests sign with real SDK keys and exercise the HTTP boundary, Borsh round-trip, signature integrity, sponsorship policy, errors, and serialized submissions. Blockchain submissions are mocked, so tests do not spend NEAR or require credentials. Running the client against the real server submits a testnet transaction and spends the relayer's NEAR for gas.

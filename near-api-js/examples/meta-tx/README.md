# Meta-transaction example

A client signs a contract call with `createSignedMetaTransaction`, encodes the signed delegate, and posts it to an Express server. The server decodes it and uses `relayMetaTransaction` to pay for the transaction gas. This uses the same near-api-js 7.4+ interface as [`../meta.ts`](../meta.ts).

## Setup

From `near-api-js/`, install dependencies and copy the example configuration:

```bash
npm install
cp examples/meta-tx/.env.example .env
```

Edit `.env` with two existing testnet accounts and their keys:

- `RELAYER_ID`: a funded account that pays transaction gas.
- `RELAYER_PRIVATE_KEYS`: a JSON array of private keys registered as full-access keys on that relayer account. `MultiKeySigner` rotates between these keys when signing transactions.
- `CLIENT_ID` and `CLIENT_PRIVATE_KEY`: an existing client account and its registered signing key.

The client account must already exist and cover its storage requirements. The relayer pays transaction gas; any attached deposit would come from the client. This example attaches zero deposit.

If you need to register another relayer key, run this once with an `Account` instance that already has a full-access signer:

```typescript
import { KeyPair } from "near-api-js";

const key = KeyPair.fromRandom("ed25519");
await relayer.addFullAccessKey(key.getPublicKey());
// Save key.toString() privately and add it to RELAYER_PRIVATE_KEYS.
```

## Run

Start the server:

```bash
npm run meta-tx:server
```

Then, in another terminal in `near-api-js/`, run the client:

```bash
npm run meta-tx:client
```

The client prints the transaction outcome. The request contains `{ "signedDelegate": "<base64 Borsh bytes>" }`; the client's private key stays on the client.

Both processes use the same testnet RPC. The server listens on `127.0.0.1:3000`. This is a local example; add sponsorship checks before exposing the endpoint. Multiple keys reduce nonce contention, but transactions that reuse a key can still complete out of order.

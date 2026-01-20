import { Account, JsonRpcProvider, KeyPair, KeyPairSigner } from "near-api-js";
import { NEAR } from "near-api-js/tokens";

import dotenv from "dotenv";

dotenv.config();

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer); // example-account.testnet

// New .testnet account
const newAccountId = Date.now() + ".testnet";

// Generate a new key
const keyPair = KeyPair.fromRandom("ed25519");
const publicKey = keyPair.getPublicKey().toString();

await account.createAccount(
  newAccountId,
  publicKey,
  NEAR.toUnits("0")
);

console.log(`Created ${newAccountId} with private key ${keyPair.toString()}`)

// Option 2: Call `testnet` directly
const newAccountId2 = Date.now() + ".testnet";

await account.callFunction({
  contractId: "testnet",
  methodName: "create_account",
  args: {
    "new_account_id": newAccountId2,
    "new_public_key": publicKey
  }
})

console.log(`Created account ${newAccountId2} with privateKey: ${keyPair.toString()}`)

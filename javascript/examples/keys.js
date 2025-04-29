import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { KeyPair } from "@near-js/crypto";
import { parseNearAmount } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Query keys with the provider
const keysProvider = await provider.viewAccessKeyList(accountId);
console.log(keysProvider);

// Create an Account object without a signer
const account = new Account(accountId, provider);

// Query keys
const accessKeys = await account.getAccessKeyList();
console.log(accessKeys);


// Create a signer and add it to the Account
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

account.setSigner(signer);

// Add full access key
const fullKeyPair = KeyPair.fromRandom("ed25519");

await account.addFullAccessKey(
  fullKeyPair.getPublicKey().toString() // ed25519:2ASWc...
);
console.log(`Added FAK ${fullKeyPair.toString()}`);

// Add function call access key
const fnKeyPair = KeyPair.fromRandom("ed25519");

await account.addFunctionAccessKey(
  fnKeyPair.getPublicKey().toString(), // The new public key ed25519:2ASWc...
  "example-contract.testnet", // Contract this key is allowed to call (optional)
  ["example_method"], // Methods this key is allowed to call (optional)
  parseNearAmount("0.25") // Gas allowance key can use to call methods (optional)
);
console.log(`Added FCK ${fnKeyPair.toString()}`);

// Use the new FullAccess Key to delete the Function Call Key
const newSigner = KeyPairSigner.fromSecretKey(fullKeyPair.toString());
account.setSigner(newSigner)
await account.deleteKey(fnKeyPair.getPublicKey().toString());

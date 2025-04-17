import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { KeyPair } from "@near-js/crypto";
import { parseNearAmount } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Get all access keys for the account
// Option 1 - via Account, or PublicAccount
const accessKeys = await account.getAccessKeyList();
console.log(accessKeys);

// Option 2 - via Provider
const accessKeys2 = await provider.viewAccessKeyList(accountId);
console.log(accessKeys2);

// Add full access key
// Generate a new key pair
const newFullKeyPair = KeyPair.fromRandom("ed25519");
const newFullPublicKey = newFullKeyPair.getPublicKey();
console.log(newFullPublicKey.toString());

const addFullKeyResult = await account.addFullAccessKey(
  newFullPublicKey // The new public key ed25519:2ASWc...
);
console.log(addFullKeyResult);

// Add function call access key
// Generate a new key pair
const newFunctionKeyPair = KeyPair.fromRandom("ed25519");
const newFunctionPublicKey = newFunctionKeyPair.getPublicKey();
console.log(newFunctionPublicKey.toString());

const addFunctionKeyResult = await account.addFunctionAccessKey(
  newFunctionPublicKey, // The new public key ed25519:2ASWc...
  "example-contract.testnet", // Contract this key is allowed to call (optional)
  ["example_method"], // Methods this key is allowed to call (optional)
  parseNearAmount("0.25") // Gas allowance key can use to call methods (optional)
);
console.log(addFunctionKeyResult);

// Delete full access key
const publicKeyToDelete = newFullPublicKey;
const deleteFullKeyResult = await account.deleteKey(publicKeyToDelete); // The public key being deleted ed25519:2ASWc...
console.log(deleteFullKeyResult);

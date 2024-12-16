import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://rpc.testnet.near.org",
};
const nearConnection = await connect(connectionConfig);

const account = await nearConnection.account(accountId);

// Get all access keys for the account
const accessKeys = await account.getAccessKeys();
console.log(accessKeys);

// Add full access key
// Generate a new key pair
const newFullKeyPair = KeyPair.fromRandom("ed25519");
const newFullPublicKey = newFullKeyPair.getPublicKey().toString();
console.log(newFullPublicKey);

const addFullKeyResult = await account.addKey(
  newFullPublicKey, // The new public key ed25519:2ASWc...
);
console.log(addFullKeyResult);

// Add function call access key
// Generate a new key pair
const newFunctionKeyPair = KeyPair.fromRandom("ed25519");
const newFunctionPublicKey = newFunctionKeyPair.getPublicKey().toString();
console.log(newFunctionPublicKey);

const addFunctionKeyResult = await account.addKey(
  newFunctionPublicKey, // The new public key ed25519:2ASWc...
  "example-contract.testnet", // Contract this key is allowed to call (optional)
  ["example_method"], // Methods this key is allowed to call (optional)
  utils.format.parseNearAmount("0.25"), // Gas allowance key can use to call methods (optional)
);
console.log(addFunctionKeyResult);

// Delete full access key
const publicKeyToDelete = newFullPublicKey;
const deleteFullKeyResult = await account.deleteKey(publicKeyToDelete); // The public key being deleted ed25519:2ASWc...
console.log(deleteFullKeyResult);

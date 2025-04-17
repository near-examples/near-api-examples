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

// Create a .testnet account
// Generate a new account ID based on the current timestamp
const newAccountId = Date.now() + ".testnet";
// Generate a new key pair
const newKeyPair = KeyPair.fromRandom("ed25519");
const newPublicKey = newKeyPair.getPublicKey().toString();
const newPrivateKey = newKeyPair.toString();
console.log("Private key", newPrivateKey);
console.log("Public key", newPublicKey);

const createAccountResult = await account.createTopLevelAccount(
  newAccountId,
  newPublicKey, // ed25519:2ASWc...
  parseNearAmount("0.1") // Initial balance for new account in yoctoNEAR
);
console.log(createAccountResult);

// Create a sub account
// Generate a new sub account ID based on the current timestamp
const newSubAccountIdPrefix = Date.now().toString();
// Generate a new key pair
const newSubKeyPair = KeyPair.fromRandom("ed25519");
const newSubPublicKey = newSubKeyPair.getPublicKey().toString();
const newSubPrivateKey = newSubKeyPair.toString();
console.log("Private key", newSubPrivateKey);
console.log("Public key", newSubPublicKey);

const createSubAccountResult = await account.createSubAccount(
  newSubAccountIdPrefix,
  newSubPublicKey, // ed25519:2ASWc...
  parseNearAmount("0.1") // Initial balance for new account in yoctoNEAR
);
console.log(createSubAccountResult);

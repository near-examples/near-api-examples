import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { KeyPair } from "@near-js/crypto";
import { parseNearAmount } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer); // example-account.testnet

// Generate a new key pair
const keyPair = KeyPair.fromRandom("ed25519");
const publicKey = keyPair.getPublicKey().toString();

const prefix = Date.now().toString();

await account.createSubAccount(
  prefix,    // prefix for the sub account (e.g. sub.near.testnet)
  publicKey, // ed25519:2ASWc...
  parseNearAmount("0.1") // Initial balance for new account in yoctoNEAR
);

console.log(`Created ${prefix}.${accountId} with private key ${keyPair.toString()}`)

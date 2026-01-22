import dotenv from "dotenv";
import { Account, JsonRpcProvider, KeyPair, KeyPairString, nearToYocto } from "near-api-js";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Generate a new account prefix and key pair
const prefix: string = Date.now().toString();
const keyPair = KeyPair.fromRandom("ed25519");
const publicKey: string = keyPair.getPublicKey().toString();

await account.createSubAccount({
  accountOrPrefix: prefix,    // prefix for the sub account (e.g. sub.near.testnet)
  publicKey, // ed25519:2ASWc...
  nearToTransfer: nearToYocto("0") // Initial balance for new account in yoctoNEAR
});

console.log(`Created ${prefix}.${accountId} with private key ${keyPair.toString()}`);

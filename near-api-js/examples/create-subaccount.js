import dotenv from "dotenv";
import { NEAR } from "near-api-js/tokens";
import { Account, JsonRpcProvider, KeyPairSigner, KeyPair } from "near-api-js";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Generate a new account prefix and key pair
const prefix = Date.now().toString();
const keyPair = KeyPair.fromRandom("ed25519");
const publicKey = keyPair.getPublicKey().toString();

await account.createSubAccount({
  accountOrPrefix: prefix,    // prefix for the sub account (e.g. sub.near.testnet)
  publicKey, // ed25519:2ASWc...
  nearToTransfer: NEAR.toUnits("0") // Initial balance for new account in yoctoNEAR
});

console.log(`Created ${prefix}.${accountId} with private key ${keyPair.toString()}`)

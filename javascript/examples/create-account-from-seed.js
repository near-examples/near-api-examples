import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";

import { generateSeedPhrase } from "near-seed-phrase";
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
// Generate a new seed phrase
const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
console.log("Seed phrase", seedPhrase);
console.log("Private key", secretKey);
console.log("Public key", publicKey);

const createAccountResult = await account.createTopLevelAccount(
  newAccountId,
  publicKey,
  parseNearAmount("0.1")
);
console.log(createAccountResult);

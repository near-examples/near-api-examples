import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";
import { parseSeedPhrase } from "near-seed-phrase";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });
const seedPhrase = process.env.SEED_PHRASE;
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via a seed phrase
const { secretKey } = parseSeedPhrase(seedPhrase); // "royal success river ..."
// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(secretKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  parseNearAmount("0.1")
);
console.log(sendTokensResult);

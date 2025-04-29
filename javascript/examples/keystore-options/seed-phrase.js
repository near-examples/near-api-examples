import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";
import { parseSeedPhrase } from "near-seed-phrase";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });

// Create a keystore and add the key pair via a seed phrase
const seedPhrase = process.env.SEED_PHRASE; // "royal success river ..."
const { secretKey } = parseSeedPhrase(seedPhrase);

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(secretKey);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  parseNearAmount("0.1")
);

console.log(sendTokensResult);

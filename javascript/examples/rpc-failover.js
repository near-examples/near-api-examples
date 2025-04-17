import { Account } from "@near-js/accounts";
import { JsonRpcProvider, FailoverRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Set up a new FailoverRpcProvider with two JSON RPC providers
const jsonProviders = [
  new JsonRpcProvider({ url: "https://incorrect-rpc-url.com" }), // Incorrect RPC URL
  new JsonRpcProvider(
    { url: "https://test.rpc.fastnear.com" }, // RPC URL
    {
      retries: 3, // Number of retries before giving up on a request
      backoff: 2, // Backoff factor for the retry delay
      wait: 500, // Wait time between retries in milliseconds
    } // Retry options
  ),
];
const provider = new FailoverRpcProvider(jsonProviders); // Create a FailoverRpcProvider

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Test the signer with transferring 1 NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  parseNearAmount("0.1")
);
console.log(sendTokensResult);

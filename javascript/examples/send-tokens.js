import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";

import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" }); // Path relative to the working directory
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

// Send NEAR tokens to another account
const sendTokensResult = await account.transfer(
  "receiver-account.testnet", // Receiver account
  parseNearAmount("0.1") // Amount being sent in yoctoNEAR
);
console.log(sendTokensResult);

import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";

import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config({ path: "../.env" });
const accountId = process.env.ACCOUNT_ID;

// Fetch the private key from a credentials file
const credentialsPath = "../credentials-file.json"; // Path relative to the working directory
const credentials = JSON.parse(fs.readFileSync(credentialsPath));
// Create a signer from the private key
const signer = KeyPairSigner.fromSecretKey(credentials.private_key);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  parseNearAmount("0.1")
);
console.log(sendTokensResult);

import { Account, JsonRpcProvider, KeyPairSigner } from "near-api-js";
import { NEAR } from "near-api-js/tokens";

import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

// Fetch the private key from a credentials file
const credentials = JSON.parse(fs.readFileSync("../credentials-file.json"));

// Create a signer from the private key
const signer = KeyPairSigner.fromSecretKey(credentials.private_key);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate the account
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"),
  receiverId: "receiver-account.testnet"
});

console.log(sendTokensResult);

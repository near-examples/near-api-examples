import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { NearToken } from "@near-js/tokens";

const NEAR = new NearToken();

import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate an account
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transferToken(
  NEAR,
  NEAR.toUnits("0.1"),
  "receiver-account.testnet"
);

console.log(sendTokensResult);

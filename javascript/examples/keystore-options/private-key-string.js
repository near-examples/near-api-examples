import { utils, KeyPairSigner, Account, providers } from "near-api-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new providers.JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  BigInt(utils.format.parseNearAmount("1")),
);
console.log(sendTokensResult);

import dotenv from "dotenv";
import { NEAR } from "near-api-js/tokens";
import { Account, JsonRpcProvider, KeyPairSigner } from "near-api-js";

// Load environment variables
dotenv.config();

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate an account
const account = new Account(process.env.ACCOUNT_ID, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"),
  receiverId: "receiver-account.testnet"
});

console.log(sendTokensResult);

import dotenv from "dotenv";
import { NEAR } from "near-api-js/tokens";
import { Account, JsonRpcProvider, KeyPairString } from "near-api-js";

// Load environment variables
dotenv.config();
const privateKey: string = process.env.PRIVATE_KEY!;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate an account
const account = new Account(accountId, provider, privateKey as KeyPairString);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"),
  receiverId: "receiver-account.testnet"
});

console.log(sendTokensResult);

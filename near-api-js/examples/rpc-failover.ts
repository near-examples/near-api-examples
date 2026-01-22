import { Account, JsonRpcProvider, FailoverRpcProvider, KeyPairString } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

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
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Test the signer with transferring 1 NEAR
const sendTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"), // Amount of NEAR being sent
  receiverId: "receiver-account.testnet", // Receiver account ID
});
console.log(sendTokensResult);

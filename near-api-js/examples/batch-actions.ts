import dotenv from "dotenv";
import { Account, JsonRpcProvider, actions, teraToGas, nearToYocto, KeyPairString } from "near-api-js";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: [
    actions.functionCall("increment", {}, teraToGas("30"), 0n),
    actions.transfer(nearToYocto("0.001"))
  ],
});

console.log(batchActionsResult);

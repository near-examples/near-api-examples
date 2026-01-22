import { nearToYocto, Account, Contract, JsonRpcProvider, KeyPairString } from "near-api-js";
import abi from "./guestbook.abi.js";
import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Make a function call that modifies state
const contract = new Contract({
  contractId: "guestbook.near-examples.testnet",
  provider: provider,
  abi: abi,
});

contract.call.add_message({
  deposit: nearToYocto("0.1"),
  args: { text: "Hello, NEAR!" },
  account: account,
}); // TypeScript infers the type of this method

// Make a read-only function call
const totalMessages = await contract.view.total_messages();
console.log({ totalMessages });

// Send a tx to add message
const result = await contract.call.add_message({
  account,
  args: { text: "Hello, world!" },
});

console.log({ result });

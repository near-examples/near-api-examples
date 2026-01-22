import { Account, Contract, JsonRpcProvider, KeyPairString, AbiRoot } from "near-api-js";
import abi from "./guestbook.abi.json" with { type: "json" };
import dotenv from "dotenv";

const guestbookAbi = abi as unknown as AbiRoot;

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const contractId: string = "guestbook.near-examples.testnet";

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Make a function call that modifies state
const contract = new Contract({
  contractId: contractId,
  provider: provider,
  abi: guestbookAbi,
});

// Make a read-only function call
const totalMessages = await contract.view.total_messages();
console.log({ totalMessages });

// Send a tx to add message
const result = await contract.call.add_message({
  account,
  args: { text: "Hello, world!" },
});

console.log({ result });

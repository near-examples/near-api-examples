import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const contractId = "guestbook.near-examples.testnet";

// Make a read-only function call
const totalMessages = await provider.callFunction(
  contractId,
  "total_messages",
  {}
);

console.log({ totalMessages });

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer); // example-account.testnet

// Make a function call that modifies state
const result = await account.callFunction({
  contractId: contractId,
  methodName: "add_message",
  args: { text: "Hello, world!" },
});

console.log({ result });
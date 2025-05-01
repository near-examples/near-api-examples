import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Send independent transactions simultaneously to different receivers
// Prepare the transactions
const tx1 = account.callFunction({
  contractId: "guestbook.near-examples.testnet",
  methodName: "add_message",
  args: { text: "Hello, world!" },
  gas: "100000000000000",
});

const tx2 = account.callFunction({
  contractId: "counter.near-examples.testnet",
  methodName: "increment",
  args: {},
  gas: "100000000000000",
});

// Send the transactions simultaneously
const transactionsResults = await Promise.all([tx1, tx2]);
console.log(transactionsResults);

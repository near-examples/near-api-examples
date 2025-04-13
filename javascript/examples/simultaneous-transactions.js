import { Account, providers, KeyPairSigner, transactions } from "near-api-js";
import dotenv from "dotenv";

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

// Send independent transactions simultaneously to different receivers
// Prepare the transactions
const tx1 = account.callFunction(
  "guestbook.near-examples.testnet",
  "add_message",
  { text: "Hello, world!" },
  0,
  "100000000000000"
);

const tx2 = account.callFunction(
  "counter.near-examples.testnet",
  "increment",
  {},
  0,
  "100000000000000"
);

// Send the transactions simultaneously
const transactionsResults = await Promise.all([tx1, tx2]);
console.log(transactionsResults);

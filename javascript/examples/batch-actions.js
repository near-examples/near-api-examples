import {
  Account,
  providers,
  KeyPairSigner,
  transactions,
  utils,
} from "near-api-js";
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

// Send a batch of actions to a single receiver
// Prepare the actions
const callAction = transactions.functionCall(
  "increment", // Method name
  {}, // Arguments
  "30000000000000", // Gas
  0 // Deposit
);
const transferAction = transactions.transfer(utils.format.parseNearAmount("1"));

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: [callAction, transferAction],
});
console.log(batchActionsResult);

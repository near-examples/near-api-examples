import dotenv from "dotenv"
import { Account, JsonRpcProvider, KeyPairSigner, actions, teraToGas, nearToYocto } from "near-api-js";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
dotenv.config(); // Loads .env
const signer = KeyPairSigner.fromSecretKey(process.env.PRIVATE_KEY); // ed25519:5Fg2...
const account = new Account(process.env.ACCOUNT_ID, provider, signer); // example-account.testnet

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: [
    actions.functionCall("increment", {}, teraToGas(30), 0),
    actions.transfer(nearToYocto("0.001"))
  ],
});

console.log(batchActionsResult);

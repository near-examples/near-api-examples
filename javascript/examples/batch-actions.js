import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";
import { actionCreators } from "@near-js/transactions";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer); // example-account.testnet

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: [
    actionCreators.functionCall("increment", {}, "30000000000000", 0),
    actionCreators.transfer(parseNearAmount("0.1"))
  ],
});

console.log(batchActionsResult);

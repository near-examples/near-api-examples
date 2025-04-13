import { Account, providers, KeyPairSigner } from "near-api-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new providers.JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Use the view call function
const viewCallData = await provider.callContractViewFunction(
  "guestbook.near-examples.testnet",
  "total_messages",
  {}
);
console.log(viewCallData);

// If args are required, they can be passed in like this:
// args: {
//   from_index: "0",
//   limit: "10"
// }

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Make a function call to a contract
const contractCallResult = await account.callFunction(
  "guestbook.near-examples.testnet",
  "add_message",
  {
    text: "Hello, world!",
  },
  0,
  "100000000000000"
);
console.log(contractCallResult);

// Deploy a contract to the account
const deployResult = await account.deployContract(
  fs.readFileSync("../contracts/contract.wasm") // Path of contract WASM relative to the working directory
);
console.log(deployResult);

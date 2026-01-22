import { Account, JsonRpcProvider } from "near-api-js";

import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Deploy a contract to the account
const result = await account.deployContract(
  fs.readFileSync("../contracts/contract.wasm") // Path of contract WASM relative to the working directory
);

console.log(result);

import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";

import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "../.env" });

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer); // example-account.testnet

// Deploy a contract to the account
const result = await account.deployContract(
  fs.readFileSync("../contracts/contract.wasm") // Path of contract WASM relative to the working directory
);

console.log(result);

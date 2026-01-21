import { Near } from "near-kit";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet with signing capabilities
const near = new Near({
  network: "testnet",
  privateKey: privateKey, // ed25519:5Fg2...
  defaultSignerId: accountId, // example-account.testnet
});

// Deploy a contract to the account
const wasmCode = fs.readFileSync("../contracts/contract.wasm");
const result = await near.transaction(accountId)
  .deployContract(accountId, wasmCode)
  .send();

console.log("Deploy contract result:", result);

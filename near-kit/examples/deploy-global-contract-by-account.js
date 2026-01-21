import { Near, generateKey } from "near-kit";
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

// Read the contract WASM
const wasmCode = fs.readFileSync("../contracts/contract.wasm");

// Publish as a global contract (identified by account ID)
// Other accounts can use this contract without deploying their own copy
const publishResult = await near
  .transaction(accountId)
  .publishContract(wasmCode, { identifiedBy: "account" })
  .send();

console.log("Published global contract:", publishResult.transaction.hash);

// Create a consumer account that will use the global contract
const consumerKey = generateKey();
const consumerAccountId = `${Date.now()}.${accountId}`;

await near
  .transaction(accountId)
  .createAccount(consumerAccountId)
  .transfer(consumerAccountId, "0.1 NEAR")
  .addKey(consumerKey.publicKey.toString(), { type: "fullAccess" })
  .send();

console.log("Created consumer account:", consumerAccountId);

// Consumer uses the global contract by referencing the publisher's account ID
const consumerNear = new Near({
  network: "testnet",
  privateKey: consumerKey.secretKey,
  defaultSignerId: consumerAccountId,
});

await consumerNear
  .transaction(consumerAccountId)
  .deployFromPublished({ accountId: accountId })
  .send();

console.log("Consumer is now using global contract from:", accountId);

// Clean up: delete consumer account
await consumerNear
  .transaction(consumerAccountId)
  .deleteAccount({ beneficiary: accountId })
  .send();

console.log("Cleaned up consumer account");

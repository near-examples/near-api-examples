import { Near, generateKey } from "near-kit";
import dotenv from "dotenv";
import fs from "fs";
import { createHash } from "crypto";

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

// Calculate the code hash (SHA-256)
const codeHash = createHash("sha256").update(wasmCode).digest();

// Publish as a global contract (identified by code hash)
// This creates an immutable contract reference
const publishResult = await near
  .transaction(accountId)
  .publishContract(wasmCode, { identifiedBy: "hash" })
  .send();

console.log("Published global contract by hash:", publishResult.transaction.hash);

// Wait for transaction to finalize
await near.getTransactionStatus(publishResult.transaction.hash, accountId, "FINAL");

// Create a consumer account
const consumerKey = generateKey();
const consumerAccountId = `${Date.now()}.${accountId}`;

const createResult = await near
  .transaction(accountId)
  .createAccount(consumerAccountId)
  .transfer(consumerAccountId, "0.1 NEAR")
  .addKey(consumerKey.publicKey.toString(), { type: "fullAccess" })
  .send();

await near.getTransactionStatus(createResult.transaction.hash, accountId, "FINAL");
console.log("Created consumer account:", consumerAccountId);

// Consumer uses the global contract by referencing the code hash
const consumerNear = new Near({
  network: "testnet",
  privateKey: consumerKey.secretKey,
  defaultSignerId: consumerAccountId,
});

await consumerNear
  .transaction(consumerAccountId)
  .deployFromPublished({ codeHash: codeHash })
  .send();

console.log("Consumer is now using global contract by hash");

// Clean up: delete consumer account
await consumerNear
  .transaction(consumerAccountId)
  .deleteAccount({ beneficiary: accountId })
  .send();

console.log("Cleaned up consumer account");

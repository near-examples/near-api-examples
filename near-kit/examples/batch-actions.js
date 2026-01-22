import { Near } from "near-kit";
import dotenv from "dotenv";

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

// Batch multiple actions in one transaction
const result = await near.transaction(accountId)
  .functionCall("counter.near-examples.testnet", "increment", {}, { gas: "30 Tgas" })
  .transfer("counter.near-examples.testnet", "0.001 NEAR")
  .send();

console.log("Batch actions result:", result);

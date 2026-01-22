import { Near } from "near-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a connection to testnet (no signing needed for view operations)
const near = new Near({ network: "testnet" });

// Get the account ID from environment or use a default
const accountId = process.env.ACCOUNT_ID || "example-account.testnet";

// Get NEAR balance for the account
const balance = await near.getBalance(accountId);

console.log(`Account: ${accountId}`);
console.log(`NEAR Balance: ${balance} NEAR`);

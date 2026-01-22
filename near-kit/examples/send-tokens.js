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

// Send NEAR tokens to another account
const result = await near.send("receiver-account.testnet", "0.1 NEAR");

console.log("Transfer result:", result);

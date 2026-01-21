import { Near } from "near-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Near client with private key directly from environment
const near = new Near({
  network: "testnet",
  privateKey: process.env.PRIVATE_KEY, // ed25519:5Fg2...
  defaultSignerId: process.env.ACCOUNT_ID, // example-account.testnet
});

// Test by sending NEAR
const result = await near.send("receiver-account.testnet", "0.1 NEAR");
console.log("Transfer result:", result);

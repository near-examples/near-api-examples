import { Near } from "near-kit";
import { FileKeyStore } from "near-kit/keys/file";
import dotenv from "dotenv";
import { homedir } from "os";
import path from "path";

// Load environment variables
dotenv.config();

// Create a FileKeyStore that reads from ~/.near-credentials
const credentialsPath = path.join(homedir(), ".near-credentials");
const keyStore = new FileKeyStore(credentialsPath, "testnet");

// Create Near client with the keyStore
const near = new Near({
  network: "testnet",
  keyStore,
  defaultSignerId: process.env.ACCOUNT_ID, // example-account.testnet
});

// Test by sending NEAR
const result = await near.send("receiver-account.testnet", "0.1 NEAR");
console.log("Transfer result:", result);

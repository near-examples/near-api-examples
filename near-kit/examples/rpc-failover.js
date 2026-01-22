import { Near } from "near-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// near-kit has built-in retry logic for RPC requests
// Configure via retryConfig for resilient RPC connections
const near = new Near({
  network: "testnet",
  rpcUrl: "https://test.rpc.fastnear.com",
  retryConfig: {
    maxRetries: 5,
    initialDelayMs: 500,
    maxDelayMs: 5000,
  },
  privateKey: privateKey, // ed25519:5Fg2...
  defaultSignerId: accountId, // example-account.testnet
});

// Test the connection by getting balance
const balance = await near.getBalance(accountId);
console.log("Balance:", balance, "NEAR");

// The retry config will automatically handle transient RPC failures
const result = await near.send("receiver-account.testnet", "0.01 NEAR");
console.log("Transfer result:", result.transaction.hash);

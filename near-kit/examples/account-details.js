import { Near } from "near-kit";

// Create a connection to testnet
const near = new Near({ network: "testnet" });

// Get account balance using the Near instance
const accountId = "example-account.testnet";
const balance = await near.getBalance(accountId);

console.log(`Account: ${accountId}`);
console.log(`Balance: ${balance} NEAR`);

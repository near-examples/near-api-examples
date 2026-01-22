import { Near } from "near-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet (no private key needed for manual signing)
const near = new Near({ network: "testnet" });

// Build a transaction manually
const tx = near
  .transaction(accountId)
  .transfer("receiver-account.testnet", "0.001 NEAR")
  .signWith(privateKey);

// Sign the transaction (but don't send yet)
await tx.sign();

// Get the transaction hash before sending
const hash = tx.getHash();
console.log("Transaction hash:", hash);

// Serialize the signed transaction (for offline use or external sending)
const serialized = tx.serialize();
console.log("Serialized transaction bytes:", serialized.length);

// Now send the signed transaction
const result = await tx.send();
console.log("Transaction sent:", result.transaction.hash);

import { Near, generateKey } from "near-kit";
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

// Generate a new key pair for the top-level account
const keyPair = generateKey();
const publicKey = keyPair.publicKey.toString();

// Create a unique top-level account name using timestamp
const newAccountId = `${Date.now()}.testnet`;

// Create the top-level account by calling the testnet contract
await near.call("testnet", "create_account", {
  new_account_id: newAccountId,
  new_public_key: publicKey,
});

console.log(`Created top-level account: ${newAccountId}`);
console.log(`Private key: ${keyPair.secretKey}`);

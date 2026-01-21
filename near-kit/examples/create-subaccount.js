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

// Generate a new key pair for the subaccount
const keyPair = generateKey();
const publicKey = keyPair.publicKey.toString();

// Create a unique subaccount name using timestamp
const prefix = Date.now().toString();
const newAccountId = `${prefix}.${accountId}`;

// Create the subaccount using transaction builder with chained actions
await near
  .transaction(accountId)
  .createAccount(newAccountId)
  .transfer(newAccountId, "0.1 NEAR")
  .addKey(publicKey, { type: "fullAccess" })
  .send();

console.log(`Created subaccount: ${newAccountId}`);
console.log(`Private key: ${keyPair.secretKey}`);

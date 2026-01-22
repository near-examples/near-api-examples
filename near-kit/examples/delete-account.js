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

// Generate a new key pair for the account to be deleted
const keyPair = generateKey();
const publicKey = keyPair.publicKey.toString();

// Create a unique top-level account name using timestamp
const accountToDelete = `${Date.now()}.testnet`;

// First, create the account by calling the testnet contract
await near.call("testnet", "create_account", {
  new_account_id: accountToDelete,
  new_public_key: publicKey,
});

console.log(`Created account: ${accountToDelete}`);

// Fund the new account so it can pay for the delete transaction
await near.send(accountToDelete, "0.01 NEAR");
console.log(`Funded account with 0.01 NEAR`);

// Create a new Near instance with the new account's key to delete it
const nearForNewAccount = new Near({
  network: "testnet",
  privateKey: keyPair.secretKey,
  defaultSignerId: accountToDelete,
});

// Delete the account, sending remaining balance to beneficiary
await nearForNewAccount
  .transaction(accountToDelete)
  .deleteAccount({ beneficiary: accountId })
  .send();

console.log(`Deleted account: ${accountToDelete}`);
console.log(`Beneficiary: ${accountId}`);

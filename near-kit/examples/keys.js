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

// Generate new key pairs
const fullAccessKey = generateKey();
const functionCallKey = generateKey();

console.log("Generated Full Access Key:", fullAccessKey.publicKey.toString());
console.log("Generated Function Call Key:", functionCallKey.publicKey.toString());

// Add a Full Access Key using transaction builder
await near
  .transaction(accountId)
  .addKey(fullAccessKey.publicKey.toString(), { type: "fullAccess" })
  .send();

console.log(`Added Full Access Key: ${fullAccessKey.publicKey.toString()}`);

// Add a Function Call Access Key using transaction builder
await near
  .transaction(accountId)
  .addKey(functionCallKey.publicKey.toString(), {
    type: "functionCall",
    receiverId: "example-contract.testnet",
    methodNames: ["example_method"],
    allowance: "0.25 NEAR",
  })
  .send();

console.log(`Added Function Call Key: ${functionCallKey.publicKey.toString()}`);

// Use the new Full Access Key to delete the Function Call Key
const nearWithNewKey = new Near({
  network: "testnet",
  privateKey: fullAccessKey.secretKey,
  defaultSignerId: accountId,
});

await nearWithNewKey
  .transaction(accountId)
  .deleteKey(accountId, functionCallKey.publicKey.toString())
  .send();

console.log(`Deleted Function Call Key: ${functionCallKey.publicKey.toString()}`);

// Delete the Full Access Key we added (using original signer)
await near
  .transaction(accountId)
  .deleteKey(accountId, fullAccessKey.publicKey.toString())
  .send();

console.log(`Deleted Full Access Key: ${fullAccessKey.publicKey.toString()}`);

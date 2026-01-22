import { Near, generateKey, RotatingKeyStore } from "near-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a RotatingKeyStore for concurrent transactions
const keyStore = new RotatingKeyStore();

// Create a connection to testnet with signing capabilities
const near = new Near({
  network: "testnet",
  privateKey: privateKey, // ed25519:5Fg2...
  defaultSignerId: accountId, // example-account.testnet
});

// Add multiple keys to the account for concurrent transactions
const keys = [];
for (let i = 0; i < 5; i++) {
  const newKey = generateKey();
  keys.push(newKey);

  // Add key to the account on-chain
  await near
    .transaction(accountId)
    .addKey(newKey.publicKey.toString(), { type: "fullAccess" })
    .send();

  // Add key to the rotating store
  await keyStore.add(accountId, newKey);
}

console.log(`Added ${keys.length} keys to account`);

// Create a new Near client with the rotating keystore
const nearWithRotating = new Near({
  network: "testnet",
  keyStore,
  defaultSignerId: accountId,
});

// Send multiple concurrent transactions
// The RotatingKeyStore will distribute keys to avoid nonce conflicts
const transfers = Array.from({ length: 10 }, (_, i) =>
  nearWithRotating.send("influencer.testnet", "0.001 NEAR")
);

const results = await Promise.all(transfers);
console.log(`Completed ${results.length} concurrent transfers`);

// Clean up: delete the keys we added
for (const key of keys) {
  await near
    .transaction(accountId)
    .deleteKey(accountId, key.publicKey.toString())
    .send();
}

console.log("Cleaned up keys");

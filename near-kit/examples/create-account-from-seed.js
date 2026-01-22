import { Near, generateSeedPhrase, parseSeedPhrase } from "near-kit";
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

// Generate a new seed phrase
const seedPhrase = generateSeedPhrase();
console.log(`Generated seed phrase: ${seedPhrase}`);

// Parse the seed phrase to get a key pair
const keyPair = parseSeedPhrase(seedPhrase);
const publicKey = keyPair.publicKey.toString();

console.log(`Derived public key: ${publicKey}`);

// Create a unique top-level account name using timestamp
const newAccountId = `acc-${Date.now()}.testnet`;

// Create the account by calling the testnet contract
await near.call("testnet", "create_account", {
  new_account_id: newAccountId,
  new_public_key: publicKey,
});

console.log(`Created account: ${newAccountId}`);
console.log(`Seed phrase: ${seedPhrase}`);

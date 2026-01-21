import { Near, parseSeedPhrase } from "near-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Parse seed phrase to get key pair
const keyPair = parseSeedPhrase(process.env.SEED_PHRASE);

// Create Near client with the derived private key
const near = new Near({
  network: "testnet",
  privateKey: keyPair.secretKey,
  defaultSignerId: process.env.ACCOUNT_ID, // example-account.testnet
});

// Test by sending NEAR
const result = await near.send("receiver-account.testnet", "0.1 NEAR");
console.log("Transfer result:", result);

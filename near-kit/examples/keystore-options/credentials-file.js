import { Near } from "near-kit";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Read credentials from a JSON file
// Note: In a real application, you would provide the path to your credentials file
const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../credentials-file.json"))
);

// Create Near client with the private key from the credentials file
const near = new Near({
  network: "testnet",
  privateKey: credentials.private_key,
  defaultSignerId: process.env.ACCOUNT_ID, // example-account.testnet
});

// Test by sending NEAR
const result = await near.send("receiver-account.testnet", "0.1 NEAR");
console.log("Transfer result:", result);

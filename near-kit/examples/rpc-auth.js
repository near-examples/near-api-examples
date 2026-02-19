import { Near } from "near-kit";
import dotenv from "dotenv";

dotenv.config();
// Replace with your own API key, or set FASTNEAR_API_KEY in .env
const apiKey = process.env.FASTNEAR_API_KEY || "1111111111111111111111111111111111111111111111111111111111111111";

// Authenticate via query parameter appended to the RPC URL
const rpcUrl = `https://rpc.mainnet.fastnear.com?apiKey=${apiKey}`;

const near = new Near({ network: "mainnet", rpcUrl });

console.log("Using authenticated FastNear RPC");

// Query account balance to verify the connection
const balance = await near.getBalance("root.near");
console.log(`Balance: ${balance} NEAR`);

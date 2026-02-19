import { JsonRpcProvider } from "near-api-js";
import dotenv from "dotenv";

dotenv.config();
// Replace with your own API key, or set FASTNEAR_API_KEY in .env
const apiKey = process.env.FASTNEAR_API_KEY || "1111111111111111111111111111111111111111111111111111111111111111";

// Create a provider with API key authentication
// The Bearer token header authenticates requests to avoid rate limiting
const provider = new JsonRpcProvider({
  url: "https://rpc.mainnet.fastnear.com",
  headers: { Authorization: `Bearer ${apiKey}` },
});

console.log("Using authenticated FastNear RPC");

// Query account state to verify the connection
const accountState = await provider.viewAccount({ accountId: "near" });
console.log(accountState);

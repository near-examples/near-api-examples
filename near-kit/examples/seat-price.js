import { Near } from "near-kit";

// Create a connection to testnet
const near = new Near({ network: "testnet" });

// Note: Seat price queries require direct RPC access to the validators endpoint
// near-kit focuses on transaction operations rather than validator queries

// For demonstration, we can query account balances
const balance = await near.getBalance("near");
console.log("NEAR Foundation balance:", balance, "NEAR");

// For actual validator seat price information, use:
// - NEAR CLI: near validators current
// - Direct RPC calls to the validators endpoint
// - API endpoint: https://docs.near.org/api/rpc/validators

console.log(
  "Note: For validator seat price, use NEAR CLI or direct RPC calls to /validators endpoint"
);

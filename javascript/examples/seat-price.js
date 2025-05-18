import { JsonRpcProvider } from "@near-js/providers";
import { formatNearAmount } from "@near-js/utils";

import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" }); // Path relative to the working directory

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const currentEpochSeatPrice = await provider.getCurrentEpochSeatPrice();

console.log(`Current epoch seat price: ${formatNearAmount(currentEpochSeatPrice.toString(), 3)}N`);

const nextEpochSeatPrice = await provider.getNextEpochSeatPrice();

console.log(`Next epoch seat price: ${formatNearAmount(nextEpochSeatPrice.toString(), 3)}N`);

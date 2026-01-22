import { JsonRpcProvider, yoctoToNear } from "near-api-js";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const currentEpochSeatPrice = await provider.getCurrentEpochSeatPrice();

console.log(`Current epoch seat price: ${yoctoToNear(currentEpochSeatPrice.toString(), 3)}N`);

const nextEpochSeatPrice = await provider.getNextEpochSeatPrice();

console.log(`Next epoch seat price: ${yoctoToNear(nextEpochSeatPrice.toString(), 3)}N`);

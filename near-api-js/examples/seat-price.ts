import { JsonRpcProvider, yoctoToNear } from "near-api-js";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const currentEpochSeatPrice: bigint = await provider.getCurrentEpochSeatPrice();

console.log(`Current epoch seat price: ${yoctoToNear(currentEpochSeatPrice, 3)}N`);

const nextEpochSeatPrice: bigint = await provider.getNextEpochSeatPrice();

console.log(`Next epoch seat price: ${yoctoToNear(nextEpochSeatPrice, 3)}N`);

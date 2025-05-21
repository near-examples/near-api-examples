import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";

// Gather details through the RPC Provider
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const rpcState = await provider.viewAccount("example-account.testnet");
console.log({ rpcState });

// Option 2: Use an Account object
const account = new Account("example-account.testnet", provider);
const accountBalance = await account.getBalance();
const accountState = await account.getState();

console.log({ accountState, accountBalance });
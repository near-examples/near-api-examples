import { Account, JsonRpcProvider } from "near-api-js";

// Option 1: Gather details through the RPC Provider
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const rpcState = await provider.viewAccount({accountId: "example-account.testnet"});
console.log(rpcState);

// Option 2: Use an Account object
const account = new Account("example-account.testnet", provider);
const accountState = await account.getState();

console.log(accountState);

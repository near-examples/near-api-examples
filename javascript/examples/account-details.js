import { PublicAccount, providers } from "near-api-js";

// Create a connection to testnet RPC
const provider = new providers.JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new PublicAccount("example-account.testnet", provider);

// Gets the total, staked and available balance in yoctoNEAR
const accountBalance = await account.getBalance();
console.log(accountBalance);

// Account's state, including its code hash and storage usage
// Option 1 - via PublicAccount
const accountState = await account.getInformation();
console.log(accountState);

// Option 2 - via Provider
const accountState2 = await provider.viewAccount("example-account.testnet");
console.log(accountState2);

import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account("example-account.testnet", provider);

// Gets the total, staked and available balance in yoctoNEAR
const accountBalance = await account.getBalance();
console.log(accountBalance);

// Account's state, including its code hash and storage usage
// Option 1 - via Account
const accountState = await account.getInformation();
console.log(accountState);

// Option 2 - via Provider
const accountState2 = await provider.viewAccount("example-account.testnet");
console.log(accountState2);

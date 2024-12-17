import { connect } from "near-api-js";

const connection = await connect({
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
});

// Create an account object
const account = await connection.account("example-account.testnet");

// Gets the total, staked and available balance in yoctoNEAR
const accountBalance = await account.getAccountBalance();
console.log(accountBalance);

// Account's state, including its code hash and storage usage
const accountState = await account.state();
console.log(accountState);

// Gets a list of authorized apps for an account
const accountDetails = await account.getAccountDetails();
console.log(accountDetails);

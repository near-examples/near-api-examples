import { Account, JsonRpcProvider, KeyPairSigner, FungibleToken } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { USDT } from "near-api-js/tokens/testnet";

import dotenv from "dotenv";

const REF = new FungibleToken("ref.fakes.testnet", {
  decimals: 18,
  symbol: "REF",
});

// Load environment variables
dotenv.config(); // Path relative to the working directory
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// ------- Send NEAR tokens to another account -------
const sendNearTokensResult = await account.transfer(
  {
    token: NEAR,
    amount: NEAR.toUnits("0.1"),
    receiverId: "receiver-account.testnet"
  }
);
console.log(sendNearTokensResult);

// ------- Send USDT tokens to another account -------
// if a user isn't registered, the transfer will fail
// it a user is already registered, we'll just get funds back
await USDT.registerAccount({
  accountIdToRegister: "receiver-account.testnet",
  fundingAccount: account,
})

// Use https://testnet.rhea.finance/#near|usdtt.fakes.testnet to get USDT token
const sendUsdtTokensResult = await account.transfer(
  {
    token: USDT,
    amount: USDT.toUnits("1"), // Amount of USDT being sent
    receiverId: "receiver-account.testnet"
  }
);
console.log(sendUsdtTokensResult);

// ------- Send REF tokens to another account -------
// Use https://testnet.rhea.finance/#near|ref.fakes.testnet to get REF tokens
const sendREFsResult = await account.transfer(
  {
    token: REF,
    amount: REF.toUnits("1"), // Amount of REF tokens being sent
    receiverId: "receiver-account.testnet"
  }
);

// we haven't registered a receiver before sending, so it may fail
console.log(sendREFsResult);

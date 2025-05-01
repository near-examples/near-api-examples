import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { FungibleToken, NearToken } from "@near-js/tokens";
import { USDT as USDTFungibleToken } from "@near-js/tokens/usdt/testnet";

import dotenv from "dotenv";

const NEAR = new NearToken();
const USDT = new USDTFungibleToken();
const REF = new FungibleToken("ref.fakes.testnet", {
  decimals: 8,
  symbol: "REF",
});

// Load environment variables
dotenv.config({ path: "../.env" }); // Path relative to the working directory
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider); // example-account.testnet

// ------- Fetch NEAR tokens formatted balance -------
const nearTokensBalance = await account.getFormattedTokenBalance(NEAR);
console.log("NEAR: ", nearTokensBalance);

// ------- Fetch USDT tokens formatted balance -------
const usdtTokensBalance = await account.getFormattedTokenBalance(USDT);
console.log("USDT: ", usdtTokensBalance);

// ------- Fetch REF tokens formatted balance -------
const refTokensBalance = await account.getFormattedTokenBalance(REF);
console.log("REF: ", refTokensBalance);

// ------- Fetch NEAR tokens balance in the smallest units as BigInt -------
const nearTokensBalanceInt = await account.getTokenBalance(NEAR);
console.log("NEAR as units: ", nearTokensBalanceInt);

// ------- Fetch USDT tokens balance in the smallest units as BigInt -------
const usdtTokensBalanceInt = await account.getTokenBalance(USDT);
console.log("USDT as units: ", usdtTokensBalanceInt);

// ------- Fetch REF tokens balance in the smallest units as BigInt -------
const refTokensBalanceInt = await account.getTokenBalance(REF);
console.log("REF as units: ", refTokensBalanceInt);

import { Account, JsonRpcProvider, FungibleToken } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { USDT } from "near-api-js/tokens/testnet";

import dotenv from "dotenv";

const REF = new FungibleToken("ref.fakes.testnet", {
  decimals: 18,
  symbol: "REF",
});

// Load environment variables
dotenv.config();
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider);

// ------- Fetch NEAR tokens balance in the smallest units as BigInt -------
const nearTokensBalanceInt = await account.getBalance(NEAR);
console.log("NEAR as units: ", nearTokensBalanceInt);
console.log("NEAR: ", NEAR.toDecimal(nearTokensBalanceInt));

// ------- Fetch USDT tokens balance in the smallest units as BigInt -------
const usdtTokensBalanceInt = await account.getBalance(USDT);
console.log("USDT as units: ", usdtTokensBalanceInt);
console.log("USDT: ", USDT.toDecimal(usdtTokensBalanceInt));

// ------- Fetch REF tokens balance in the smallest units as BigInt -------
const refTokensBalanceInt = await account.getBalance(REF);
console.log("REF as units: ", refTokensBalanceInt);
console.log("REF: ", REF.toDecimal(refTokensBalanceInt));

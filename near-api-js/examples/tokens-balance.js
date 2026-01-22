import { Account, JsonRpcProvider } from "near-api-js";
import { NEAR, FungibleToken } from "near-api-js/tokens";
import { USDT } from "near-api-js/tokens/testnet";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const accountId = 'influencer.testnet';
const account = new Account(accountId, provider);

// ------- Fetch NEAR tokens balance -------
const nearTokensBalanceInt = await account.getBalance(NEAR);
console.log("NEAR: ", NEAR.toDecimal(nearTokensBalanceInt, 2));

// ------- Fetch USDT tokens balance -------
const usdtTokensBalanceInt = await account.getBalance(USDT);
console.log("USDT: ", USDT.toDecimal(usdtTokensBalanceInt, 2));

// ------- Fetch REF tokens balance in the smallest units as BigInt -------
const REF = new FungibleToken("ref.fakes.testnet", {
  decimals: 18,
  symbol: "REF",
});

const refTokensBalanceInt = await account.getBalance(REF);
console.log("REF: ", REF.toDecimal(refTokensBalanceInt, 2));

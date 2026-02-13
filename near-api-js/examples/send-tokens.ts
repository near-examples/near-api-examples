import dotenv from "dotenv";
import { Account, JsonRpcProvider, KeyPairString } from "near-api-js";
import { NEAR, FungibleToken } from "near-api-js/tokens";
import { USDT } from "near-api-js/tokens/testnet";

// Load environment variables
dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// ------- Send NEAR tokens to another account -------
const sendNearTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"),
  receiverId: "influencer.testnet"
});
console.log(sendNearTokensResult);

// ------- Send USDT tokens to another account -------
// NOTE: Use https://testnet.rhea.finance/#near|usdtt.fakes.testnet to get USDT token
const sendUsdtTokensResult = await account.transfer({
  token: USDT,
  amount: USDT.toUnits("1"), // Amount of USDT being sent
  receiverId: "influencer.testnet"
});
console.log(sendUsdtTokensResult);

// ------- Send REF tokens to another account -------
// Use https://testnet.rhea.finance/#near|ref.fakes.testnet to get REF tokens
const REF = new FungibleToken("ref.fakes.testnet", {
  decimals: 18,
  symbol: "REF",
  name: "REF Token",
});

const sendREFsResult = await account.transfer({
  token: REF,
  amount: REF.toUnits("1"), // Amount of REF tokens being sent
  receiverId: "influencer.testnet"
}).catch(() => {}); // ignore errors if already registered

console.log(sendREFsResult);

// Lower level Primitives
console.log(
  "Is influencer.testnet registered for USDT?",
  await USDT.isAccountRegistered({
    accountId: "influencer.testnet",
    provider,
  })
)

console.log(
  "Registering influencer.testnet for USDT",
  await USDT.registerAccount({
    accountIdToRegister: "influencer.testnet",
    fundingAccount: account,
  })
)

// ------- Sending tokens to an unregistered account will automatically register it -------
const randomAccountId = `${Math.random().toString(36).substring(2, 15)}.testnet`;

const isRegistered = await USDT.isAccountRegistered({
    accountId: randomAccountId,
    provider,
  })

if (isRegistered) throw new Error(`${randomAccountId} is already registered`);

await account.transfer({
  token: USDT,
  amount: USDT.toUnits("1"),
  receiverId: randomAccountId,
});

const randomAccount = new Account(randomAccountId, provider);
const balance = await USDT.getBalance(randomAccount);
console.log(`Balance of ${randomAccountId}:`, USDT.toDecimal(balance));
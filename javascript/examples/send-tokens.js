import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { FungibleToken, NearToken } from "@near-js/tokens";
import { USDT as USDTFungibleToken } from "@near-js/tokens/usdt/testnet";

import dotenv from "dotenv";

const NEAR = new NearToken();
const USDT = new USDTFungibleToken();
const RefToken = new FungibleToken("ref.fakes.testnet", {
  decimals: 8,
  symbol: "REF",
});

// Load environment variables
dotenv.config({ path: "../.env" }); // Path relative to the working directory
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

// Send NEAR tokens to another account
const sendNearTokensResult = await account.transferToken(
  NEAR,
  NEAR.toUnits("0.1"), // Amount being sent in yoctoNEAR
  "receiver-account.testnet" // Receiver account
);

console.log(sendNearTokensResult);

const usdtBalance = await account.getFormattedTokenBalance(USDT);

console.log("USDT balance", usdtBalance);

// Send USDT tokens to another account
const sendUsdtTokensResult = await account.transferToken(
  USDT,
  USDT.toUnits("1"), // Amount of USDT being sent
  "receiver-account.testnet" // Receiver account
);

console.log(sendUsdtTokensResult);

const refBalance = await account.getFormattedTokenBalance(RefToken);

console.log("Ref balance", refBalance);

// Send USDT tokens to another account
const sendRefTokensResult = await account.transferToken(
  RefToken,
  RefToken.toUnits("1"), // Amount of Ref tokens being sent
  "receiver-account.testnet" // Receiver account
);

console.log(sendRefTokensResult);

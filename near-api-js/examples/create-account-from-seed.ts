import { Account, JsonRpcProvider, KeyPairString } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { generateSeedPhrase } from "near-api-js/seed-phrase";
import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate the account that will create the new account
const account = new Account(accountId, provider, privateKey);

// Generate a new key
const { seedPhrase, keyPair } = generateSeedPhrase();
console.log(`Created key ${keyPair.toString()} with seed phrase ${seedPhrase}`);

await account.createAccount({
  newAccountId: `acc-${Date.now()}.testnet`,
  publicKey: keyPair.getPublicKey().toString(),
  nearToTransfer: NEAR.toUnits("0.1")
});

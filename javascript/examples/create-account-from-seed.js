import { Account, JsonRpcProvider, KeyPairSigner } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { generateSeedPhrase } from "near-api-js/seed-phrase";
import dotenv from "dotenv";

dotenv.config();

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate the account that will create the new account
const signer = KeyPairSigner.fromSecretKey(process.env.PRIVATE_KEY);
const account = new Account(process.env.ACCOUNT_ID, provider, signer);

// Generate a new key
const { seedPhrase, keyPair } = generateSeedPhrase();
console.log(`Created key ${keyPair.toString()} with seed phrase ${seedPhrase}`);

await account.createTopLevelAccount(
  `acc-${Date.now()}.testnet`,
  keyPair.getPublicKey(),
  NEAR.toUnits("0.1")
);

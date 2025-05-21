import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { NEAR } from "@near-js/tokens";
import { generateSeedPhrase } from "near-seed-phrase";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate the account that will create the new account
const signer = KeyPairSigner.fromSecretKey(process.env.PRIVATE_KEY);
const account = new Account(process.env.ACCOUNT_ID, provider, signer);

// Generate a new key
const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
console.log(`Created key ${secretKey} with seed phrase ${seedPhrase}`);

await account.createTopLevelAccount(
  `acc-${Date.now()}.testnet`,
  publicKey,
  NEAR.toUnits("0.1")
);

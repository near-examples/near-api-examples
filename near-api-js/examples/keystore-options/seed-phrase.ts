import dotenv from "dotenv";
import { NEAR } from "near-api-js/tokens";
import { parseSeedPhrase } from "near-api-js/seed-phrase";
import { Account, JsonRpcProvider, KeyPairString } from "near-api-js";

// Load environment variables
dotenv.config();
const accountId: string = process.env.ACCOUNT_ID!;

// Create a keystore and add the key pair via a seed phrase
const seedPhrase: string = process.env.SEED_PHRASE!; // "royal success river ..."
const keyPair = parseSeedPhrase(seedPhrase);
const secretKey = keyPair.toString() as KeyPairString;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, secretKey);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"),
  receiverId: "receiver-account.testnet"
});

console.log(sendTokensResult);

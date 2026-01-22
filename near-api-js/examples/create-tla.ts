import dotenv from "dotenv";
import { NEAR } from "near-api-js/tokens";
import { Account, JsonRpcProvider, KeyPair, KeyPairString } from "near-api-js";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// Generate a new accountId and key
const newAccountId: string = Date.now() + ".testnet";
const keyPair = KeyPair.fromRandom("ed25519");
const publicKey: string = keyPair.getPublicKey().toString();

await account.createAccount({
  newAccountId,
  publicKey,
  nearToTransfer: NEAR.toUnits("0")
});

console.log(`Created ${newAccountId} with private key ${keyPair.toString()}`);

// Option 2: Call `testnet` directly
const newAccountId2: string = Date.now() + ".testnet";

await account.callFunction({
  contractId: "testnet",
  methodName: "create_account",
  args: {
    "new_account_id": newAccountId2,
    "new_public_key": publicKey
  }
});

console.log(`Created account ${newAccountId2} with privateKey: ${keyPair.toString()}`);

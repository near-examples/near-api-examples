import { Account, JsonRpcProvider, KeyPairSigner, KeyPair } from "near-api-js";
import { NEAR } from "near-api-js/tokens";

import dotenv from "dotenv";

dotenv.config();

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const keyPair = KeyPair.fromString(privateKey);
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create a new account to be deleted
const accountId = process.env.ACCOUNT_ID;
const master = new Account(accountId, provider, signer)

const deleteMe = `${Date.now()}.testnet`;

await master.createTopLevelAccount(
  deleteMe,
  keyPair.getPublicKey().toString(),
  NEAR.toUnits("0.1")
);

// Create an account object for the new account with corresponding signer
const accountToDelete = new Account(deleteMe, provider, signer);

// Delete the account 
await accountToDelete.deleteAccount(accountId); // example-beneficiary.testnet
console.log(`Account ${deleteMe} was deleted`);

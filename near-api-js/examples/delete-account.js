import dotenv from "dotenv";
import { Account, JsonRpcProvider, KeyPairSigner, KeyPair } from "near-api-js";
import { NEAR } from "near-api-js/tokens";

dotenv.config();
const accountId = process.env.ACCOUNT_ID;
const privateKey = process.env.PRIVATE_KEY;
const keyPair = KeyPair.fromString(privateKey);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create a new account to be deleted
const master = new Account(accountId, provider, privateKey)

const deleteMe = `${Date.now()}.testnet`;

await master.createAccount({
  newAccountId: deleteMe,
  publicKey: keyPair.getPublicKey().toString(),
  nearToTransfer: NEAR.toUnits("0.1")
});

// Create an account object for the new account with corresponding signer
const accountToDelete = new Account(deleteMe, provider, privateKey);

// Delete the account 
await accountToDelete.deleteAccount(accountId); // example-beneficiary.testnet
console.log(`Account ${deleteMe} was deleted`);

import dotenv from "dotenv";
import { Account, JsonRpcProvider, KeyPair, KeyPairString, nearToYocto } from "near-api-js";

dotenv.config();
const accountId: string = process.env.ACCOUNT_ID!;
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const keyPair = KeyPair.fromString(privateKey);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create a new account to be deleted
const master = new Account(accountId, provider, privateKey);

const deleteMe: string = `${Date.now()}.testnet`;

await master.createAccount({
  newAccountId: deleteMe,
  publicKey: keyPair.getPublicKey().toString(),
  nearToTransfer: nearToYocto("0.1")
});

// Create an account object for the new account with corresponding signer
const accountToDelete = new Account(deleteMe, provider, privateKey);

// Delete the account 
const beneficiary: string = process.env.ACCOUNT_ID!;
await accountToDelete.deleteAccount(beneficiary);
console.log(`Account ${deleteMe} was deleted`);

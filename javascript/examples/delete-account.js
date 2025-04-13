import { Account, providers, KeyPairSigner, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const beneficiaryAccountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new providers.JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(beneficiaryAccountId, provider, signer); // example-account.testnet

// First create a new account to be deleted
// Generate a new account ID based on the current timestamp
const accountToDeleteId = Date.now() + ".testnet";
const newKeyPair = KeyPair.fromRandom("ed25519");
const newPublicKey = newKeyPair.getPublicKey().toString();

await account.createTopLevelAccount(
  accountToDeleteId,
  newPublicKey,
  utils.format.parseNearAmount("0.1")
);

// Create a signer from a key pair that was added to new account
const signerToDelete = new KeyPairSigner(newKeyPair);

// Create an account object for the new account with corresponding signer
const accountToDelete = new Account(accountToDeleteId, provider, signerToDelete);

// Delete the account with account ID of the account object
// specifying the beneficiary account ID
const deleteAccountResult = await accountToDelete.deleteAccount(
  beneficiaryAccountId
); // example-beneficiary.testnet
console.log(deleteAccountResult);

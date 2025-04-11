import * as nearAPI from "near-api-js";
import dotenv from "dotenv";

const { Account, providers, KeyPairSigner, utils } = nearAPI;

// Load environment variables
dotenv.config({ path: "../.env" }); // Path relative to the working directory
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new providers.JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Send NEAR tokens to another account
const sendTokensResult = await account.transfer(
  "receiver-account.testnet", // Receiver account
  BigInt(utils.format.parseNearAmount("1")) // Amount being sent in yoctoNEAR
);
console.log(sendTokensResult);

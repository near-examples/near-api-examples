import { Account, JsonRpcProvider, KeyPairSigner, KeyPairString } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

// Fetch the private key from a credentials file
interface Credentials {
  private_key: string;
}
const credentials: Credentials = JSON.parse(fs.readFileSync("../credentials-file.json", "utf-8"));

// Create a signer from the private key
const signer = KeyPairSigner.fromSecretKey(credentials.private_key as KeyPairString);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Instantiate the account
const accountId: string = process.env.ACCOUNT_ID!;
const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer({
  token: NEAR,
  amount: NEAR.toUnits("0.1"),
  receiverId: "receiver-account.testnet"
});

console.log(sendTokensResult);

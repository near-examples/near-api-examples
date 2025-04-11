import {
  providers,
  keyStores,
  Account,
  KeyPairSigner,
  utils,
} from "near-api-js";

import dotenv from "dotenv";
import { homedir } from "os";
import path from "path";

// Load environment variables
dotenv.config({ path: "../.env" });
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via credentials directory
const credentialsDirectory = ".near-credentials";
const credentialsPath = path.join(homedir(), credentialsDirectory);
const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

// Create a connection to testnet RPC
const provider = new providers.JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const keyPair = await myKeyStore.getKey("testnet", accountId);

const signer = new KeyPairSigner(keyPair);

const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  BigInt(utils.format.parseNearAmount("1"))
);
console.log(sendTokensResult);

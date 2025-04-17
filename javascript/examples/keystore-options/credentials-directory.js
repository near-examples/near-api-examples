import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { parseNearAmount } from "@near-js/utils";
import { UnencryptedFileSystemKeyStore } from "@near-js/keystores-node";

import dotenv from "dotenv";
import { homedir } from "os";
import path from "path";

// Load environment variables
dotenv.config({ path: "../.env" });
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via credentials directory
const credentialsDirectory = ".near-credentials";
const credentialsPath = path.join(homedir(), credentialsDirectory);
const myKeyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const keyPair = await myKeyStore.getKey("testnet", accountId);

const signer = new KeyPairSigner(keyPair);

const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  parseNearAmount("0.1")
);
console.log(sendTokensResult);

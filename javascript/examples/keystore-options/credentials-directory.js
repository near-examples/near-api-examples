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

// Create a keystore that stores keys in the `~/.near-credentials`
const credentialsDirectory = ".near-credentials";
const credentialsPath = path.join(homedir(), credentialsDirectory);
const myKeyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Get the key from the keystore
const keyPair = await myKeyStore.getKey("testnet", accountId);
const signer = new KeyPairSigner(keyPair);

// Instantiate the account
const accountId = process.env.ACCOUNT_ID;
const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transfer(
  "receiver-account.testnet",
  parseNearAmount("0.1")
);

console.log(sendTokensResult);

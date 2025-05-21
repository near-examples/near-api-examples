import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { UnencryptedFileSystemKeyStore } from "@near-js/keystores-node";
import { NearToken } from "@near-js/tokens";

const NEAR = new NearToken();

import dotenv from "dotenv";
import { homedir } from "os";
import path from "path";

// Load environment variables
dotenv.config({ path: "../.env" });

// Create a keystore that stores keys in the `~/.near-credentials`
const credentialsDirectory = ".near-credentials";
const credentialsPath = path.join(homedir(), credentialsDirectory);
const myKeyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Get the key from the keystore
const keyPair = await myKeyStore.getKey("testnet", accountId);
const signer = new KeyPairSigner(keyPair);

// Instantiate the account
const account = new Account(accountId, provider, signer);

// Test the signer by transferring NEAR
const sendTokensResult = await account.transferToken(
  NEAR,
  NEAR.toUnits("0.1"),
  "receiver-account.testnet"
);

console.log(sendTokensResult);

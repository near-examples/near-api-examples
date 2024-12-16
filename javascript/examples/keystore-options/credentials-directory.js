import { connect, keyStores, utils } from "near-api-js";
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

// Create a connection to the NEAR testnet
const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://rpc.testnet.near.org",
};
const nearConnection = await connect(connectionConfig);

// Create an account object
const account = await nearConnection.account(accountId); // example-account.testnet

// Test the signer by transferring NEAR
const sendTokensResult = await account.sendMoney(
  "receiver-account.testnet",
  utils.format.parseNearAmount("1"),
);
console.log(sendTokensResult);

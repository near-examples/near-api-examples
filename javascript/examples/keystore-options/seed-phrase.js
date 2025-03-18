import { connect, keyStores, KeyPair, utils } from "near-api-js";
import { parseSeedPhrase } from "near-seed-phrase";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });
const seedPhrase = process.env.SEED_PHRASE;
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via a seed phrase
const { secretKey } = parseSeedPhrase(seedPhrase); // "royal success river ..."
const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(secretKey); // ed25519::5Fg2...
await myKeyStore.setKey("testnet", accountId, keyPair);

// Create a connection to NEAR testnet
const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://test.rpc.fastnear.com",
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

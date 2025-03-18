import { connect, keyStores, KeyPair, utils } from "near-api-js";
import { generateSeedPhrase } from "near-seed-phrase";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://test.rpc.fastnear.com",
};
const nearConnection = await connect(connectionConfig);

const account = await nearConnection.account(accountId);

// Create a .testnet account
// Generate a new account ID based on the current timestamp
const newAccountId = Date.now() + ".testnet";
// Generate a new seed phrase
const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
console.log("Seed phrase", seedPhrase);
console.log("Private key", secretKey);
console.log("Public key", publicKey);

const createAccountResult = await account.functionCall({
  contractId: "testnet",
  methodName: "create_account",
  args: {
    new_account_id: newAccountId, // example-account.testnet
    new_public_key: publicKey, // ed25519:2ASWc...
  },
  attachedDeposit: utils.format.parseNearAmount("0.1"), // Initial balance for new account in yoctoNEAR
});
console.log(createAccountResult);

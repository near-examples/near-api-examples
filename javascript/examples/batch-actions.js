import { connect, keyStores, KeyPair, transactions, utils } from "near-api-js";
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

// Send a batch of actions to a single receiver
// Prepare the actions
const callAction = transactions.functionCall(
  "increment", // Method name
  [], // Arguments
  "30000000000000", // Gas
  0, // Deposit
);
const transferAction = transactions.transfer(utils.format.parseNearAmount("1"));

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: [callAction, transferAction],
});
console.log(batchActionsResult);

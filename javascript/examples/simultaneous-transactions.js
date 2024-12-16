import { connect, keyStores, KeyPair, transactions } from "near-api-js";
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
  nodeUrl: "https://rpc.testnet.near.org",
};
const nearConnection = await connect(connectionConfig);

const account = await nearConnection.account(accountId);

// Send independent transactions simultaneously to different receivers
// Prepare the transactions
const args = Buffer.from(JSON.stringify({ text: "Hello, world!" }));
const tx1 = account.signAndSendTransaction({
  receiverId: "guestbook.near-examples.testnet",
  actions: [
    transactions.functionCall(
      "add_message", // Method name
      args, // Arguments
      100000000000000, // Gas
      0, // Deposit
    ),
  ],
});

const tx2 = account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: [
    transactions.functionCall(
      "increment", // Method name
      [], // Arguments
      100000000000000, // Gas
      0, // Deposit
    ),
  ],
});

// Send the transactions simultaneously
const transactionsResults = await Promise.all([tx1, tx2]);
console.log(transactionsResults);

import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { actionCreators } from "@near-js/transactions";
import { KeyPair } from "@near-js/crypto";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey);

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const account = new Account(accountId, provider, signer); // example-account.testnet

// Transactions can only be truly simultaneous if signed with different key pairs,
// since each key tracks its own nonce, sending multiple transactions from the same key,
// even with distinct nonces, risks race conditions and execution conflicts.

// 1. (Optional) Create two different key pairs and add them to your account
// This step is optional, so you can skip it if you already have the keys ready.
const keyPairOne = KeyPair.fromRandom("ed25519");
console.log("KeyPair One:", keyPairOne.getPublicKey().toString());

const keyPairTwo = KeyPair.fromRandom("ed25519");
console.log("KeyPair Two:", keyPairTwo.getPublicKey().toString());

// add two keys in a single transaction
await account.signAndSendTransaction({
  receiverId: account.accountId,
  actions: [
    actionCreators.addKey(
      keyPairOne.getPublicKey(),
      actionCreators.fullAccessKey()
    ),
    actionCreators.addKey(
      keyPairTwo.getPublicKey(),
      actionCreators.fullAccessKey()
    ),
  ],
  waitUntil: "FINAL",
});

const accountOne = new Account(
  accountId,
  provider,
  new KeyPairSigner(keyPairOne)
);
const accountTwo = new Account(
  accountId,
  provider,
  new KeyPairSigner(keyPairTwo)
);

// 2. Construct the transactions
const signedTxOne = await accountOne.createSignedTransaction(
  "guestbook.near-examples.testnet",
  [
    actionCreators.functionCall(
      "add_message",
      { text: "Hello, world!" },
      "30000000000000",
      0
    ),
  ]
);
const signedTxTwo = await accountTwo.createSignedTransaction(
  "counter.near-examples.testnet",
  [actionCreators.functionCall("increment", {}, "30000000000000", 0)]
);

console.log("Created two different signed transactions");

// 3. Send the transactions
const sendTxOne = provider.sendTransaction(signedTxOne);
const sendTxTwo = provider.sendTransaction(signedTxTwo);

// Wait for them to finish
const transactionsResults = await Promise.all([sendTxOne, sendTxTwo]);
console.log(transactionsResults);

// 4. (Optional) Since we created these keys just for this example, we’ll remove them afterward
// But in a real application, you don’t need to delete them unless there's a specific reason to.

// delete two keys in a single transaction
await account.signAndSendTransaction({
  receiverId: account.accountId,
  actions: [
    actionCreators.deleteKey(keyPairOne.getPublicKey()),
    actionCreators.deleteKey(keyPairTwo.getPublicKey()),
  ],
});

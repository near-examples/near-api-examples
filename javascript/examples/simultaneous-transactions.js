import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { actionCreators, createTransaction } from "@near-js/transactions";
import { baseDecode } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey);
const signerPublicKey = await signer.getPublicKey();

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// 1. Get information about the access key
const accessKey = await provider.viewAccessKey(accountId, signerPublicKey);

// 2. Get a recent block hash
const recentBlockHash = baseDecode(accessKey.block_hash);

// 3. Construct the transactions
let actions = [actionCreators.functionCall("add_message", { text: "Hello, world!" }, "30000000000000", 0)];

let nonce = ++accessKey.nonce;

const addMessage = createTransaction(
  accountId,
  signerPublicKey,
  "guestbook.near-examples.testnet",
  nonce,
  actions,
  recentBlockHash
);

// increment nonce so there are no collisions
nonce = nonce + 1n;

actions = [actionCreators.functionCall("increment", {}, "30000000000000", 0)]
const increment = createTransaction(
  accountId,
  signerPublicKey,
  "counter.near-examples.testnet",
  nonce,
  actions,
  recentBlockHash
);

// 4. Sign the transactions
const [txHash1, signedTransaction1] = await signer.signTransaction(addMessage);
const [txHash2, signedTransaction2] = await signer.signTransaction(increment);

console.log(Buffer.from(txHash1).toString("hex"));
console.log(Buffer.from(txHash2).toString("hex"));

// 5. Send the transactions
const tx1 = provider.sendTransaction(signedTransaction1);
const tx2 = provider.sendTransaction(signedTransaction2);

// Wait for them to finish
const transactionsResults = await Promise.all([tx1, tx2]);
console.log(transactionsResults);

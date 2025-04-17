import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { actionCreators, createTransaction } from "@near-js/transactions";
import { parseNearAmount, baseDecode } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a signer from a private key string
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const signerPublicKey = await signer.getPublicKey();

// Get the nonce of the key
const accessKey = await provider.viewAccessKey(accountId, signerPublicKey);

const nonce = ++accessKey.nonce;

// Get a recent block hash
const recentBlockHash = baseDecode(accessKey.block_hash);

// Construct actions
const actions = [actionCreators.transfer(parseNearAmount("0.1"))];

// Construct transaction
const transaction = createTransaction(
  accountId,
  signerPublicKey,
  "receiver-account.testnet",
  nonce,
  actions,
  recentBlockHash
);

const [txHash, signedTransaction] = await signer.signTransaction(transaction);
console.log(Buffer.from(txHash).toString("hex"));

// Send transaction
const sendTransactionResult = await provider.sendTransaction(signedTransaction);
console.log(sendTransactionResult);

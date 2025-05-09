import { JsonRpcProvider } from "@near-js/providers";
import { Account } from "@near-js/accounts";
import { KeyPairSigner } from "@near-js/signers";
import { actionCreators, createTransaction } from "@near-js/transactions";
import { parseNearAmount, baseDecode } from "@near-js/utils";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const accountId = process.env.ACCOUNT_ID;

// Create a provider for testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Assume there is a signer that will sign the transaction
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// We only need to know the public key of the signer
const signerPublicKey = await signer.getPublicKey();

// We create a transaction manually

// 1. Get the nonce of the key
const accessKey = await provider.viewAccessKey(accountId, signerPublicKey);
const nonce = ++accessKey.nonce;

// 2. Get a recent block hash
const recentBlockHash = baseDecode(accessKey.block_hash);

// 3. Construct the transaction
const actions = [actionCreators.transfer(parseNearAmount("0.1"))];

const transaction = createTransaction(
  accountId,
  signerPublicKey,
  "receiver-account.testnet",
  nonce,
  actions,
  recentBlockHash
);

// Sign and send
const [txHash, signedTransaction] = await signer.signTransaction(transaction);
console.log(Buffer.from(txHash).toString("hex"));

// Send transaction
const sendTransactionResult = await provider.sendTransaction(signedTransaction);
console.log(sendTransactionResult);


/**
 * We can also simply instantiate an account object (that does not require a signer)
 * and use let it construct the transaction for us.
 */

// 1. Instantiate account
const account = new Account(accountId, provider);

// 2. Create transaction
const transaction2 = await account.createTransaction(
  "receiver-account.testnet",
  actions,
  signerPublicKey
)

// 3. Sign transaction
const [txHash2, signedTransaction2] = await signer.signTransaction(transaction2);
console.log(Buffer.from(txHash2).toString("hex"));

// 4. Send transaction
const sendTransactionResult2 = await provider.sendTransaction(signedTransaction2);
console.log(sendTransactionResult2);

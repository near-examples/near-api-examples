import { JsonRpcProvider, Account, KeyPairSigner, actionCreators, createTransaction, baseDecode } from "near-api-js";
import { NEAR } from "near-api-js/tokens";

import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a provider for testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Assume there is a signer that will sign the transaction
const signer = KeyPairSigner.fromSecretKey(privateKey);

// **We only need to know the public key of the signer**
const signerPublicKey = await signer.getPublicKey();

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

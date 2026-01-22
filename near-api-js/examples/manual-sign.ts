import { JsonRpcProvider, Account, KeyPairSigner, actions, KeyPairString } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

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
const transaction = await account.createTransaction({
  receiverId: "receiver-account.testnet",
  actions: [actions.transfer(NEAR.toUnits("0.1"))],
  publicKey: signerPublicKey
});

// 3. Sign transaction
const signResult = await signer.signTransaction(transaction);
console.log(signResult.signedTransaction.transaction.signerId);

// 4. Send transaction
const sendTransactionResult = await provider.sendTransaction(signResult.signedTransaction);
console.log(sendTransactionResult);

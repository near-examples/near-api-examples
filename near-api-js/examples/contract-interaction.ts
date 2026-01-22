import dotenv from "dotenv";
import { Account, JsonRpcProvider, teraToGas, KeyPairString, nearToYocto } from "near-api-js";

// Create an account object
dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a testnet provider
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// For read only calls, you can use the provider directly
const messages = await provider.callFunction({
  contractId: 'guestbook.near-examples.testnet',
  method: "get_messages",
  args: {},
});

console.log(messages);

// To modify state, you need an account to sign the transaction
const account = new Account(accountId, provider, privateKey);

// Call the contract
await account.callFunction({
  contractId: 'guestbook.near-examples.testnet',
  methodName: "add_message",
  args: { text: "Hello!" },
  gas: teraToGas('30'),
  deposit: nearToYocto('0.1'),
});

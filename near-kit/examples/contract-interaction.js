import dotenv from "dotenv";
import { Near } from "near-kit";

// Create a connection to testnet with credentials
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const near = new Near({
  network: "testnet",
  privateKey,
  defaultSignerId: accountId
});

// For read only calls, you can use the provider directly
const messages = await near.view(
  'guestbook.near-examples.testnet',
  'get_messages',
  {}
);

console.log(messages);

// To modify state, call the contract method
await near.call(
  'guestbook.near-examples.testnet',
  'add_message',
  { text: "Hello!" },
  { gas: "30 Tgas" }
);

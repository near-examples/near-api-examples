import { Near } from "near-kit";
import dotenv from "dotenv";

dotenv.config();

// Create a connection to testnet with credentials from environment
const near = new Near({
  network: "testnet",
  privateKey: process.env.PRIVATE_KEY,
  defaultSignerId: process.env.ACCOUNT_ID
});

// Define the contract interface
const guestbook = near.contract("guestbook.near-examples.testnet");

// View: get total messages
const totalMessages = await guestbook.view.total_messages();
console.log({ totalMessages });

// Call: add a message
const result = await guestbook.call.add_message({ text: "Hello from near-kit!" }, { gas: "30 Tgas" });
console.log({ result });

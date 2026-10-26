import dotenv from "dotenv";
import {
  Account, JsonRpcProvider, actions, encodeSignedDelegate, teraToGas,
  type KeyPairString,
} from "near-api-js";

dotenv.config();
const provider = new JsonRpcProvider({
  url: process.env.RPC_URL ?? "https://test.rpc.fastnear.com",
});
const client = new Account(
  process.env.CLIENT_ID!, provider, process.env.CLIENT_PRIVATE_KEY! as KeyPairString,
);

// Sign the contract call locally, without sending a transaction.
const { signedDelegate } = await client.createSignedMetaTransaction({
  receiverId: process.env.CONTRACT_ID ?? "hello.near-examples.testnet",
  actions: [actions.functionCall("set_greeting", { greeting: "Hello!" }, teraToGas(10), 0n)],
  blockHeightTtl: 120,
});

const response = await fetch(process.env.RELAYER_URL ?? "http://127.0.0.1:3000/relay", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    signedDelegate: Buffer.from(encodeSignedDelegate(signedDelegate)).toString("base64"),
  }),
});
const outcome = await response.json();
if (!response.ok) throw new Error(JSON.stringify(outcome));
console.log(outcome);

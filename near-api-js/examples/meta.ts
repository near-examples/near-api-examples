import dotenv from "dotenv";
import type { KeyPairString } from "near-api-js";
import { Account, JsonRpcProvider, KeyPair, teraToGas, nearToYocto, actions, keyToImplicitAddress } from "near-api-js";

import { NEAR } from "near-api-js/tokens";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Random implicit account
const newKeyPair = KeyPair.fromRandom("ED25519")
const implicit = new Account(
  keyToImplicitAddress(newKeyPair.getPublicKey()),
  provider,
  newKeyPair.toString()
);

// try to call a function with the implicit account
try {
  await implicit.callFunction({
    contractId: "hello.near-examples.testnet",
    methodName: "set_greeting",
    args: { greeting: "Hello" },
    gas: teraToGas(10),
    deposit: nearToYocto("0"),
  });
  throw new Error("Expected an error but the call succeeded");
} catch (error: any) {
  console.log("As expected, the call failed for the implicit account");
  console.log("Error message:", error.message);
}

// Load credentials for an account that exists
dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Instantiate the account and transfer 1 yoctoNEAR to the implicit account
const account = new Account(accountId, provider, privateKey);

await account.transfer({
  receiverId: implicit.accountId,
  amount: 1, // 1 yocto
  token: NEAR
});

// Now, lets create a meta-transaction with the implicit and relay it using the funded account
const metaTx = await implicit.createSignedMetaTransaction({
  receiverId: "hello.near-examples.testnet",
  actions: [
    actions.functionCall("set_greeting", { greeting: "meta" }, teraToGas(10), nearToYocto("0"))
  ]
});

// Relay the meta-transaction using the funded account
const result = await account.relayMetaTransaction(metaTx.signedDelegate);
console.log("Meta-transaction result:", result);

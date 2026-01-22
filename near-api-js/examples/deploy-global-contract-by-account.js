import { Account, JsonRpcProvider, KeyPair } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { readFileSync } from "fs";

import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const deployer = new Account(accountId, provider, privateKey); // example-account.testnet

// Path of contract WASM relative to the working directory
const wasm = readFileSync("../contracts/contract.wasm");
const deployResult = await deployer.deployGlobalContract(wasm, "accountId");

console.log(deployResult);

const key = KeyPair.fromRandom("ed25519");
const consumerAccountId = `${Date.now()}.${deployer.accountId}`;
await deployer.createAccount({
  newAccountId: consumerAccountId,
  publicKey: key.getPublicKey().toString(),
  nearToTransfer: NEAR.toUnits("0.1")
});
console.log("Consumer", consumerAccountId);
const consumer = new Account(
  consumerAccountId,
  provider,
  key.toString()
);

await consumer.useGlobalContract({ accountId: deployer.accountId });

const contract = await consumer.getContractCode();
console.log("Size", contract.code.length, "Hash", contract.hash);

// delete consumer account and refund deployer
await consumer.deleteAccount(deployer.accountId);

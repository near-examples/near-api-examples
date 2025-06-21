import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { readFileSync } from "fs";

import dotenv from "dotenv";
import { KeyPair } from "@near-js/crypto";
import { NEAR } from "@near-js/tokens";

dotenv.config({ path: "../.env" });

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create a signer from a private key string
const privateKey = process.env.PRIVATE_KEY;
const signer = KeyPairSigner.fromSecretKey(privateKey); // ed25519:5Fg2...

// Create an account object
const accountId = process.env.ACCOUNT_ID;
const deployer = new Account(accountId, provider, signer); // example-account.testnet

// Path of contract WASM relative to the working directory
const wasm = readFileSync("../contracts/contract.wasm");
const deployResult = await deployer.deployGlobalContract(wasm, "accountId");

console.log(deployResult);

const key = KeyPair.fromRandom("ed25519");
const consumerAccountId = `${Date.now()}.${deployer.accountId}`;
await deployer.createAccount(
  consumerAccountId,
  key.getPublicKey(),
  NEAR.toUnits("0.1")
);
console.log("Consumer", consumerAccountId);
const consumer = new Account(
  consumerAccountId,
  provider,
  new KeyPairSigner(key)
);

await consumer.useGlobalContract({ accountId: deployer.accountId });

const contract = await consumer.getContractCode();
console.log("Size", contract.code.length, "Hash", contract.hash);

// delete consumer account and refund deployer
await consumer.deleteAccount(deployer.accountId);

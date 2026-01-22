import { Account, JsonRpcProvider, KeyPair } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { readFileSync } from "fs";
import bs58 from "bs58";

import dotenv from "dotenv";
import { sha256 } from "@noble/hashes/sha256";

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
const deployResult = await deployer.deployGlobalContract(wasm, "codeHash");

console.log(deployResult);
await provider.viewTransactionStatus(deployResult.transaction.hash, deployer.accountId, 'FINAL');

const hash = bs58.encode(sha256(wasm));

const key = KeyPair.fromRandom("ed25519");
const consumerAccountId = `${Date.now()}.${deployer.accountId}`;
const { transaction } = await deployer.createAccount({
  newAccountId: consumerAccountId,
  publicKey: key.getPublicKey().toString(),
  nearToTransfer: NEAR.toUnits("0.1")
});
await provider.viewTransactionStatus(transaction.hash, deployer.accountId, 'FINAL');
console.log("Consumer", consumerAccountId);
const consumer = new Account(
  consumerAccountId,
  provider,
  key.toString()
);

const useResult = await consumer.useGlobalContract({
  codeHash: bs58.decode(hash),
});
console.log(useResult);
await provider.viewTransactionStatus(useResult.transaction.hash, consumer.accountId, 'FINAL');

const contract = await consumer.getContractCode();
console.log("Size", contract.code.length, "Hash", contract.hash);

// delete consumer account and refund deployer
await consumer.deleteAccount(deployer.accountId);

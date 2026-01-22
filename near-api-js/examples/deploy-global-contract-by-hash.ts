import { Account, JsonRpcProvider, KeyPair, KeyPairString, baseEncode } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import { readFileSync } from "fs";
import { createHash } from "crypto";
import dotenv from "dotenv";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY! as KeyPairString;
const accountId: string = process.env.ACCOUNT_ID!;

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const deployer = new Account(accountId, provider, privateKey); // example-account.testnet

// Path of contract WASM relative to the working directory
const wasm: Uint8Array = new Uint8Array(readFileSync("../contracts/contract.wasm"));
const deployResult = await deployer.deployGlobalContract(wasm, "codeHash");

console.log(deployResult);
await provider.viewTransactionStatus({ txHash: deployResult.transaction.hash, accountId: deployer.accountId });

const hash: string = baseEncode(createHash('sha256').update(wasm).digest());

const key = KeyPair.fromRandom("ed25519");
const consumerAccountId: string = `${Date.now()}.${deployer.accountId}`;
const { transaction } = await deployer.createAccount({
  newAccountId: consumerAccountId,
  publicKey: key.getPublicKey().toString(),
  nearToTransfer: NEAR.toUnits("0.1")
});
await provider.viewTransactionStatus({ txHash: transaction.hash, accountId: deployer.accountId });
console.log("Consumer", consumerAccountId);
const consumer = new Account(
  consumerAccountId,
  provider,
  key.toString() as KeyPairString
);

const useResult = await consumer.useGlobalContract({
  codeHash: Uint8Array.from(Buffer.from(hash, 'base64')),
});
console.log(useResult);
await provider.viewTransactionStatus({ txHash: useResult.transaction.hash, accountId: consumer.accountId });

const contract = await consumer.getContractCode();
console.log("Size", contract.code.length, "Hash", contract.hash);

// delete consumer account and refund deployer
await consumer.deleteAccount(deployer.accountId);

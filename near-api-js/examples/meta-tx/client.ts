import { pathToFileURL } from "node:url";
import {
  Account, actions, encodeSignedDelegate, teraToGas,
  type KeyPairString,
} from "near-api-js";
import { createProvider, loadConfig, requiredEnv } from "./config.js";

export async function sendGreeting(
  account: Account,
  contractId: string,
  greeting: string,
  serverUrl: string,
  token: string,
) {
  // Sign locally without broadcasting a transaction or paying transaction gas.
  const metaTx = await account.createSignedMetaTransaction({
    receiverId: contractId,
    actions: [actions.functionCall("set_greeting", { greeting }, teraToGas(10), 0n)],
    blockHeightTtl: 120,
  });

  // Borsh preserves u64/u128 values and signatures across the HTTP boundary.
  const response = await fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      signedDelegate: Buffer.from(encodeSignedDelegate(metaTx.signedDelegate)).toString("base64"),
    }),
    signal: AbortSignal.timeout(60_000),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Relayer returned HTTP ${response.status}: ${JSON.stringify(result)}`);
  }
  return result;
}

async function main() {
  loadConfig("client");
  const account = new Account(
    requiredEnv("CLIENT_ID"), createProvider(), requiredEnv("CLIENT_PRIVATE_KEY") as KeyPairString,
  );
  const result = await sendGreeting(
    account,
    process.env.CONTRACT_ID ?? "hello.near-examples.testnet",
    process.env.GREETING ?? "Hello from a meta transaction!",
    process.env.RELAYER_URL ?? "http://127.0.0.1:3000/relay",
    requiredEnv("RELAYER_TOKEN"),
  );
  console.log("Relayed transaction:", JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

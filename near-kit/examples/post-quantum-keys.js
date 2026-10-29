import { MlDsa65KeyPair, Near } from "near-kit";
import dotenv from "dotenv";
import { privateKeyFromString } from "./helpers/private-key.js";

// Use an existing testnet account and its full-access key.
dotenv.config({ path: "../.env" });
const accountId = process.env.ACCOUNT_ID;
if (!accountId) throw new Error("ACCOUNT_ID is required");
const near = new Near({
  network: "testnet",
  privateKey: privateKeyFromString(process.env.PRIVATE_KEY),
  defaultSignerId: accountId,
});

// Generate an ML-DSA-65 key and register it using the existing signer.
const pqKey = MlDsa65KeyPair.fromRandom();
const publicKey = pqKey.publicKey.toString();
await near
  .transaction(accountId)
  .addKey(publicKey, { type: "fullAccess" })
  .send({ waitUntil: "FINAL" });
console.log("Added post-quantum key:", publicKey);

try {
  const pqNear = new Near({
    network: "testnet",
    privateKey: privateKeyFromString(pqKey.secretKey),
    defaultSignerId: accountId,
  });

  // Sign a self-transfer with the post-quantum key. This transaction pays gas.
  await pqNear.transaction(accountId).transfer(accountId, "0.001 NEAR").send();
  console.log("Post-quantum self-transfer completed");
} finally {
  // Remove the temporary key using the original signer.
  await near.transaction(accountId).deleteKey(accountId, publicKey).send();
  console.log("Removed post-quantum key:", publicKey);
}

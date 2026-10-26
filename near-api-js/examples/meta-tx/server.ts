import dotenv from "dotenv";
import express from "express";
import { deserialize } from "borsh";
import {
  Account, JsonRpcProvider, MultiKeySigner, SCHEMA,
  type KeyPairString, type SignedDelegate,
} from "near-api-js";

dotenv.config();
const provider = new JsonRpcProvider({
  url: process.env.RPC_URL ?? "https://test.rpc.fastnear.com",
});

// All keys must be registered as full-access keys on the relayer account.
const privateKeys = JSON.parse(process.env.RELAYER_PRIVATE_KEYS!) as KeyPairString[];
const signer = MultiKeySigner.fromSecretKeys(privateKeys);
const relayer = new Account(process.env.RELAYER_ID!, provider, signer);

const app = express();
app.use(express.json());

app.post("/relay", async (req, res) => {
  try {
    const bytes = Buffer.from(req.body.signedDelegate, "base64");
    const signedDelegate = deserialize(SCHEMA.SignedDelegate, bytes) as unknown as SignedDelegate;
    const outcome = await relayer.relayMetaTransaction(signedDelegate);
    res.json(outcome);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "127.0.0.1", () => console.log(`Relayer: http://127.0.0.1:${port}/relay`));

import { createServer, type IncomingMessage } from "node:http";
import { pathToFileURL } from "node:url";
import { deserialize } from "borsh";
import {
  Account, SCHEMA, encodeSignedDelegate, teraToGas,
  type KeyPairString, type SignedDelegate,
} from "near-api-js";
import { createProvider, loadConfig, requiredEnv } from "./config.js";

const MAX_BODY_BYTES = 16 * 1024;

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function readDelegate(req: IncomingMessage): Promise<SignedDelegate> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, "Request body is too large");
    chunks.push(Buffer.from(chunk));
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (typeof body?.signedDelegate !== "string") throw new Error();
    const bytes = Buffer.from(body.signedDelegate, "base64");
    if (!bytes.length || bytes.toString("base64") !== body.signedDelegate) throw new Error();
    const signedDelegate = deserialize(SCHEMA.SignedDelegate, bytes) as unknown as SignedDelegate;
    // Reject trailing bytes and noncanonical encodings as well as invalid Borsh.
    if (!Buffer.from(encodeSignedDelegate(signedDelegate)).equals(bytes)) throw new Error();
    return signedDelegate;
  } catch {
    throw new HttpError(400, "Expected a base64 Borsh signedDelegate in a JSON object");
  }
}

export function createRelayerServer(
  relayer: Pick<Account, "relayMetaTransaction">,
  policy: { senderId: string; contractId: string; token: string },
) {
  // One process and one relayer key: serialize submissions to avoid nonce races.
  let pending: Promise<unknown> = Promise.resolve();
  return createServer(async (req, res) => {
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body, (_, value) => typeof value === "bigint" ? value.toString() : value));
    };
    try {
      if (req.url !== "/relay") throw new HttpError(404, "Not found");
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        throw new HttpError(405, "Use POST /relay");
      }
      if (req.headers.authorization !== `Bearer ${policy.token}`) {
        throw new HttpError(401, "Invalid relayer token");
      }
      if (req.headers["content-type"]?.split(";")[0].trim() !== "application/json") {
        throw new HttpError(415, "Use Content-Type: application/json");
      }
      const signedDelegate = await readDelegate(req);
      const delegate = signedDelegate.delegateAction;
      const call = delegate.actions[0]?.functionCall;
      if (
        delegate.senderId !== policy.senderId || delegate.receiverId !== policy.contractId ||
        delegate.actions.length !== 1 || !call || call.methodName !== "set_greeting" ||
        call.deposit !== 0n || call.gas <= 0n || call.gas > teraToGas(10)
      ) {
        throw new HttpError(403, "Only the configured sender's zero-deposit greeting calls are sponsored");
      }

      // The network verifies the signature, access key permissions, nonce, and expiry.
      const submission = pending.then(() => relayer.relayMetaTransaction(signedDelegate));
      pending = submission.catch(() => {});
      const outcome = await submission;
      send(200, { outcome });
    } catch (error) {
      if (error instanceof HttpError) send(error.status, { error: error.message });
      else send(502, { error: "Relay failed; check the transaction on-chain before retrying" });
    }
  });
}

function main() {
  loadConfig("server");
  const relayer = new Account(
    requiredEnv("RELAYER_ID"), createProvider(), requiredEnv("RELAYER_PRIVATE_KEY") as KeyPairString,
  );
  const server = createRelayerServer(relayer, {
    senderId: requiredEnv("ALLOWED_SENDER_ID"),
    contractId: process.env.CONTRACT_ID ?? "hello.near-examples.testnet",
    token: requiredEnv("RELAYER_TOKEN"),
  });
  const port = Number(process.env.PORT ?? "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.listen(port, "127.0.0.1", () => console.log(`Relayer listening on http://127.0.0.1:${port}/relay`));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

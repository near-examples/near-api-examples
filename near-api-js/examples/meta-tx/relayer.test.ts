import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { mock, test } from "node:test";
import {
  Account, JsonRpcProvider, KeyPair, actions, encodeDelegateAction, encodeSignedDelegate, teraToGas,
  type SignedDelegate,
} from "near-api-js";
import { sendGreeting } from "./client.js";
import { createRelayerServer } from "./server.js";

const policy = { senderId: "client.testnet", contractId: "hello.near-examples.testnet", token: "test-token" };
const provider = new JsonRpcProvider({ url: "http://unused.invalid" });
mock.method(provider, "viewAccessKey", async () => ({ nonce: 42n, permission: "FullAccess" }));
mock.method(provider, "viewBlock", async () => ({ header: { height: 1000 } }));
const clientKey = KeyPair.fromRandom("ed25519");
const client = new Account(policy.senderId, provider, clientKey.toString());

async function delegate(overrides: Parameters<Account["createSignedMetaTransaction"]>[0] = {
  receiverId: policy.contractId,
  actions: [actions.functionCall("set_greeting", { greeting: "hello" }, teraToGas(10), 0n)],
}) {
  return (await client.createSignedMetaTransaction(overrides)).signedDelegate;
}

async function withServer(
  relay: (signedDelegate: SignedDelegate) => Promise<unknown>,
  run: (url: string) => Promise<void>,
) {
  // The HTTP boundary is real; only the blockchain submission is stubbed.
  const server = createRelayerServer({ relayMetaTransaction: relay as Account["relayMetaTransaction"] }, policy);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}/relay`);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

function post(url: string, body: unknown, token = policy.token) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

function encode(signedDelegate: SignedDelegate) {
  return { signedDelegate: Buffer.from(encodeSignedDelegate(signedDelegate)).toString("base64") };
}

test("client signs, encodes, posts, and relayer wraps the identical delegate for its sender", async () => {
  const relayer = new Account("relayer.testnet", provider, KeyPair.fromRandom("ed25519").toString());
  let relayed: SignedDelegate | undefined;
  // Exercise the SDK's real relayMetaTransaction without sending a funded transaction.
  const submission = mock.method(relayer, "signAndSendTransaction", async (args: Parameters<Account["signAndSendTransaction"]>[0]) => {
    assert.equal(args.receiverId, policy.senderId);
    assert.equal(args.actions.length, 1);
    const wrapped = args.actions[0].signedDelegate;
    assert.ok(wrapped);
    assert.deepEqual(encodeSignedDelegate(wrapped), encodeSignedDelegate(relayed!));
    return { transaction: { hash: "test-hash" }, status: { SuccessValue: "" }, nonce: 43n };
  });
  await withServer(async (value) => {
    relayed = value;
    const hash = createHash("sha256").update(encodeDelegateAction(value.delegateAction)).digest();
    assert.ok(clientKey.verify(hash, Uint8Array.from(value.signature.ed25519Signature!.data)));
    assert.equal(value.delegateAction.nonce, 43n);
    assert.equal(value.delegateAction.maxBlockHeight, 1120n);
    return relayer.relayMetaTransaction(value);
  }, async (url) => {
    const result = await sendGreeting(client, policy.contractId, "hello", url, policy.token);
    assert.equal(result.outcome.transaction.hash, "test-hash");
    assert.equal(result.outcome.nonce, "43");
    assert.equal(submission.mock.callCount(), 1);
  });
});

test("HTTP rejects unauthenticated, malformed, oversized, and unsupported requests before submission", async () => {
  let submissions = 0;
  await withServer(async () => { submissions++; }, async (url) => {
    assert.equal((await post(url, {}, "wrong-token")).status, 401);
    assert.equal((await post(url, {})).status, 400);
    assert.equal((await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${policy.token}` }, body: "{" })).status, 400);
    assert.equal((await post(url, { signedDelegate: "not-base64" })).status, 400);
    assert.equal((await post(url, { signedDelegate: Buffer.from([255]).toString("base64") })).status, 400);
    assert.equal((await post(url, { signedDelegate: "x".repeat(17 * 1024) })).status, 413);
    assert.equal((await fetch(url)).status, 405);
    assert.equal((await fetch(url.replace("/relay", "/unknown"))).status, 404);
    assert.equal((await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${policy.token}` }, body: "{}" })).status, 415);
    const valid = encode(await delegate());
    const bytes = Buffer.concat([Buffer.from(valid.signedDelegate, "base64"), Buffer.from([0])]);
    assert.equal((await post(url, { signedDelegate: bytes.toString("base64") })).status, 400);
    assert.equal(submissions, 0);
  });
});

test("policy rejects other senders, receivers, methods, gas limits, deposits, and action types", async () => {
  let submissions = 0;
  const validCall = actions.functionCall("set_greeting", {}, teraToGas(10), 0n);
  const disallowed = [
    await delegate({ receiverId: "other.testnet", actions: [validCall] }),
    await delegate({ receiverId: policy.contractId, actions: [] }),
    ...[
      [actions.transfer(1n)],
      [actions.functionCall("other_method", {}, teraToGas(10), 0n)],
      [actions.functionCall("set_greeting", {}, teraToGas(11), 0n)],
      [actions.functionCall("set_greeting", {}, 0n, 0n)],
      [actions.functionCall("set_greeting", {}, teraToGas(10), 1n)],
      [validCall, validCall],
    ].map(actionList => ({ receiverId: policy.contractId, actions: actionList })),
  ];
  const other = await delegate();
  other.delegateAction.senderId = "other.testnet";
  await withServer(async () => { submissions++; }, async (url) => {
    for (const value of disallowed) {
      const signed = "delegateAction" in value ? value : await delegate(value);
      assert.equal((await post(url, encode(signed))).status, 403);
    }
    assert.equal((await post(url, encode(other))).status, 403);
    assert.equal(submissions, 0);
  });
});

test("submissions are serialized and an RPC failure does not block later requests", async () => {
  let active = 0;
  let maxActive = 0;
  let calls = 0;
  await withServer(async () => {
    calls++;
    active++;
    maxActive = Math.max(maxActive, active);
    await new Promise(resolve => setTimeout(resolve, 10));
    active--;
    if (calls === 1) throw new Error("simulated RPC failure");
    return { status: { SuccessValue: "" } };
  }, async (url) => {
    const body = encode(await delegate());
    const results = await Promise.all([post(url, body), post(url, body), post(url, body)]);
    assert.deepEqual(results.map(result => result.status).sort(), [200, 200, 502]);
    assert.equal(maxActive, 1);
    assert.equal(calls, 3);
  });
});

test("client reports relayer rejection", async () => {
  await withServer(async () => assert.fail("must not relay"), async (url) => {
    await assert.rejects(sendGreeting(client, policy.contractId, "hello", url, "wrong-token"), /HTTP 401/);
  });
});

import { Near, verifyNep413Signature } from "near-kit";

// Create Near client for testnet (no signing needed for verification)
const near = new Near({ network: "testnet" });

// The challenge given to the user to sign
const MESSAGE = "log me in";
const APP = "http://localhost:3000";
const CHALLENGE = Buffer.from(Array.from(Array(32).keys()));

// The object returned by wallet.signMessage in wallet selector
const signedMessage = {
  signature:
    "IfModLa3g3czlyPhkg/LSkTFSy7XCGreStZJTDIO1m3viEnYFLdXfpz1gYUVKYv3W2vwcV77TmGEzc9y0Nz+AA==",
  accountId: "maguila.testnet",
  publicKey: "ed25519:AtH7GEjv2qmBVoT8qoRhWXizXM5CC12DC6tiqY9iNoRm",
};

// Verify the signature
const isValid = await verifyNep413Signature(
  signedMessage,
  {
    message: MESSAGE,
    recipient: APP,
    nonce: CHALLENGE,
  },
  { near, maxAge: Infinity }, // Disable timestamp check for this demo
);

console.log("Signature valid:", isValid);

import { verifyMessage } from "near-api-js/nep413"
import { JsonRpcProvider } from "near-api-js";

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// This is the challenge given to the user to sign
const MESSAGE = "log me in"
const APP = "http://localhost:3000"
const CHALLENGE = Buffer.from(Array.from(Array(32).keys()))

// This is the object returned by `wallet.signMessage` in wallet selector
const walletReturn = {
    "signature": "IfModLa3g3czlyPhkg/LSkTFSy7XCGreStZJTDIO1m3viEnYFLdXfpz1gYUVKYv3W2vwcV77TmGEzc9y0Nz+AA==",
    "accountId": "maguila.testnet",
    "publicKey": "ed25519:AtH7GEjv2qmBVoT8qoRhWXizXM5CC12DC6tiqY9iNoRm"
}

await verifyMessage({ 
    signerAccountId: walletReturn.accountId,
    signerPublicKey: walletReturn.publicKey,
    signature: new Uint8Array(Buffer.from(walletReturn.signature, 'base64')),
    payload: {
        message: MESSAGE,
        recipient: APP,
        nonce: CHALLENGE
    },
    provider
 })
import { authenticate } from "./authentication.js"

const MESSAGE = "log me in"
const APP = "http://localhost:3000"
const CHALLENGE = Buffer.from(Array.from(Array(32).keys()))

// This is the object returned by `wallet.signMessage` in wallet selector
const msg = {
    "signature": "IfModLa3g3czlyPhkg/LSkTFSy7XCGreStZJTDIO1m3viEnYFLdXfpz1gYUVKYv3W2vwcV77TmGEzc9y0Nz+AA==",
    "accountId": "maguila.testnet",
    "publicKey": "ed25519:AtH7GEjv2qmBVoT8qoRhWXizXM5CC12DC6tiqY9iNoRm"
}

authenticate({ accountId: msg.accountId, publicKey: msg.publicKey, signature: msg.signature, message: MESSAGE, recipient: APP, nonce: CHALLENGE }).then(console.log)
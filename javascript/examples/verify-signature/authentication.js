import * as borsh from 'borsh';
import { PublicKey } from '@near-js/crypto';
import js_sha256 from 'js-sha256';

class Payload {
    constructor({ message, nonce, recipient, callbackUrl }) {
        this.tag = 2147484061;
        this.message = message;
        this.nonce = nonce;
        this.recipient = recipient;
        if (callbackUrl) { this.callbackUrl = callbackUrl }
    }
}

const payloadSchema = { struct: { tag: 'u32', message: 'string', nonce: { array: { type: 'u8', len: 32 } }, recipient: 'string', callbackUrl: { option: "string" } } }

async function authenticate({ accountId, publicKey, signature, message, recipient, nonce }) {
    // A user is correctly authenticated if:
    // - The key used to sign belongs to the user and is a Full Access Key
    // - The object signed contains the right message and domain
    const full_key_of_user = await verifyFullKeyBelongsToUser({ accountId, publicKey })
    const valid_signature = verifySignature({ publicKey, signature, message, recipient, nonce })
    return valid_signature && full_key_of_user
}

function verifySignature({ publicKey, signature, message, recipient, nonce }) {
    // Reconstruct the expected payload to be signed
    const payload = new Payload({ message, recipient, nonce });
    const serialized = borsh.serialize(payloadSchema, payload);
    const to_sign = Uint8Array.from(js_sha256.sha256.array(serialized))

    // Reconstruct the signature from the parameter given in the URL
    let real_signature = Buffer.from(signature, 'base64')

    // Use the public Key to verify that the private-counterpart signed the message
    const myPK = PublicKey.from(publicKey)
    return myPK.verify(to_sign, real_signature)
}

async function verifyFullKeyBelongsToUser({ publicKey, accountId }) {
    // Call the public RPC asking for all the users' keys
    let data = await fetch_all_user_keys({ accountId })

    // if there are no keys, then the user could not sign it!
    if (!data || !data.result || !data.result.keys) return false

    // check all the keys to see if we find the used_key there
    for (const k in data.result.keys) {
        if (data.result.keys[k].public_key === publicKey) {
            // Ensure the key is full access, meaning the user had to sign
            // the transaction through the wallet
            return data.result.keys[k].access_key.permission == "FullAccess"
        }
    }

    return false // didn't find it
}

// Aux method
async function fetch_all_user_keys({ accountId }) {
    const keys = await fetch(
        "https://test.rpc.fastnear.com",
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: `{"jsonrpc":"2.0", "method":"query", "params":["access_key/${accountId}", ""], "id":1}`
        }).then(data => data.json()).then(result => result)
    return keys
}

export { authenticate }

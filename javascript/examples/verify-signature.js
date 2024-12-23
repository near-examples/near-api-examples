import { KeyPair, transactions, providers, utils } from "near-api-js";
import sha256 from "js-sha256";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const keyPair = KeyPair.fromString(privateKey);

const provider = new providers.JsonRpcProvider({
  url: "https://rpc.testnet.near.org",
});

// Get the nonce of the key
const accessKey = await provider.query(
  `access_key/${accountId}/${keyPair.getPublicKey().toString()}`,
  "",
);
const nonce = ++accessKey.nonce;

// Get a recent block hash
const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);

// Construct actions
const actions = [transactions.transfer(utils.format.parseNearAmount("1"))];

// Construct transaction
const transaction = transactions.createTransaction(
  accountId,
  keyPair.getPublicKey(),
  "receiver-account.testnet",
  nonce,
  actions,
  recentBlockHash,
);

// Serialize transaction
const serializedTx = utils.serialize.serialize(
  transactions.SCHEMA.Transaction,
  transaction,
);

// Get serialized transaction hash
const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));

// Get signature
const signature = keyPair.sign(serializedTxHash);

// Check if signature is valid 
const isValid = keyPair.verify(serializedTxHash, signature.signature);
console.log(isValid); // Returns true or false
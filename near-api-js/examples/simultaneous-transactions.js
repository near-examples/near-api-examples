import dotenv from "dotenv"
import { NEAR } from "near-api-js/tokens"
import { Account, actions, JsonRpcProvider, KeyPair, MultiKeySigner } from "near-api-js"

dotenv.config(); // Loads .env
const privateKey = process.env.PRIVATE_KEY
const accountId = process.env.ACCOUNT_ID

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
})

// Create 10 keys and add them to the account
const account = new Account(accountId, provider, privateKey)

const keys = []
const txActions = []
for (let j = 0; j < 10; j++) {
  const newKeyPair = KeyPair.fromRandom('ed25519')
  keys.push(newKeyPair)
  txActions.push(actions.addFullAccessKey(newKeyPair.getPublicKey()))
}

await account.signAndSendTransaction({
  receiverId: accountId,
  actions: txActions
})

// Send NEAR tokens using multiple keys
const multiKeySigner = new MultiKeySigner(keys)
const multiAccount = new Account(accountId, provider, multiKeySigner)

const transfers = [...Array(100)].map(() =>
  multiAccount.transfer({
    token: NEAR,
    amount: NEAR.toUnits("0.001"),
    receiverId: "influencer.testnet"
  })
)

const sendNearTokensResults = await Promise.all(transfers)
sendNearTokensResults.forEach(result => console.log(result))

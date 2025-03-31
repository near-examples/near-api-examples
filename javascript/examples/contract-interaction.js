import { connect, keyStores, KeyPair, providers } from "near-api-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "../.env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://test.rpc.fastnear.com",
};
const nearConnection = await connect(connectionConfig);

const account = await nearConnection.account(accountId);

// Make a view call to a contract
async function viewContract({
  contractId,
  methodName,
  args = {},
  finality = "optimistic",
}) {
  // Set up a new provider
  const url = `https://test.rpc.fastnear.com`;
  const provider = new providers.JsonRpcProvider({ url });

  // Convert the arguments to base64
  const argsBase64 = args
    ? Buffer.from(JSON.stringify(args)).toString("base64")
    : "";

  // Make the view call
  const viewCallResult = await provider.query({
    request_type: "call_function",
    account_id: contractId,
    method_name: methodName,
    args_base64: argsBase64,
    finality: finality,
  });

  // Parse the result
  return JSON.parse(Buffer.from(viewCallResult.result).toString());
}

// Use the view call function
const viewCallData = await viewContract({
  contractId: "guestbook.near-examples.testnet",
  methodName: "total_messages",
});
console.log(viewCallData);

// If args are required, they can be passed in like this:
// args: {
//   from_index: "0",
//   limit: "10"
// }

// Make a function call to a contract
const contractCallResult = await account.functionCall({
  contractId: "guestbook.near-examples.testnet", // Contract account ID
  methodName: "add_message", // Method to call
  args: {
    text: "Hello, world!",
  }, // Arguments for the method
  gas: 100000000000000, // Optional: gas limit
  attachedDeposit: 0, // Optional: deposit in yoctoNEAR
});
console.log(contractCallResult);

// Deploy a contract to the account
const deployResult = await account.deployContract(
  fs.readFileSync("../contracts/contract.wasm"), // Path of contract WASM relative to the working directory
);
console.log(deployResult);

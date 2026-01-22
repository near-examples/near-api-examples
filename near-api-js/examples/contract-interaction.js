import { Account, JsonRpcProvider } from "near-api-js";

// Create a testnet provider
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// Create an account object
const privateKey = "ed25519:5nMxVjR3idXu9TiKLw69SxAfoBuHuJJ2uozamfwsrdoKBwmkXTJWf9LDrrwbJ7nfLb8e8Ja7AtUihYbypATWe2iw";
const accountId = "gain-adult-structure.testnet";
const account = new Account(accountId, provider, privateKey); // example-account.testnet

// First call, with ecdsa signature
const ecdsa = await account.callFunction({
  contractId: 'v1.signer-prod.testnet',
  methodName: "sign",
  args: {
    request: {
      payload_v2: { 'Ecdsa': '5f3f680429798f95c31a6176ed29322539573459560affee1ac39944a90dd191' },
      path: 'test',
      domain_id: 0
    }
  },
  deposit: '1',
  gas: '30000000000000',
});

console.log({ ecdsa });

// Second call, with eddsa signature
const eddsa = await account.callFunction({
  contractId: 'v1.signer-prod.testnet',
  methodName: "sign",
  args: {
    request: {
      payload_v2: { "Eddsa": "01000103f4c2920c126179e614afd2dcfddf71f31d32267198bbfbeedf49e6fdf393cb0cdfedba60c362cbfa11805184949096d8094686429b80c44717ebe71928e51f0b0000000000000000000000000000000000000000000000000000000000000000b67870443c1f6737846e916a7209ad656d9f218d0daff513d4caaadb2ef6ce4401020200010c0200000000ca9a3b00000000" },
      path: 'test',
      domain_id: 1
    }
  },
  deposit: '1',
  gas: '30000000000000',
});

console.log({ eddsa });
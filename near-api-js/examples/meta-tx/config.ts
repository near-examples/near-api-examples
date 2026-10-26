import dotenv from "dotenv";
import { JsonRpcProvider } from "near-api-js";

// Each process loads only its own credentials file.
export function loadConfig(role: "client" | "server") {
  dotenv.config({ path: `examples/meta-tx/.env.${role}` });
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in the environment or credentials file`);
  return value;
}

export function createProvider() {
  return new JsonRpcProvider({
    url: process.env.RPC_URL ?? "https://test.rpc.fastnear.com",
  });
}

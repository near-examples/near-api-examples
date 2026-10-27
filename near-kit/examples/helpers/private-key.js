import { parseKey } from "near-kit";

/**
 * Parse and validate serialized key material before passing it to the client.
 * @param {string | undefined} value
 * @returns {import("near-kit").PrivateKey}
 */
export function privateKeyFromString(value) {
  if (!value) throw new Error("A private key is required for this example");
  // near-kit returns a plain string here, even though parseKey validated it.
  return /** @type {import("near-kit").PrivateKey} */ (parseKey(value).secretKey);
}

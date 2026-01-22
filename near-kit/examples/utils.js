import { Amount, parseAmount, formatAmount } from "near-kit";

// Create amount using Amount helpers
const amountFromNear = Amount.NEAR(0.1);
console.log("0.1 NEAR in yoctoNEAR:", amountFromNear);

const amountFromYocto = Amount.yocto(1000000000000000000000000n);
console.log("1e24 yoctoNEAR:", amountFromYocto);

// Parse human-readable amount string to yoctoNEAR
const parsed = parseAmount("0.1 NEAR");
console.log("Parsed '0.1 NEAR' to yoctoNEAR:", parsed);

// Format yoctoNEAR back to human-readable string
const formatted = formatAmount("100000000000000000000000");
console.log("Formatted yoctoNEAR to NEAR:", formatted);

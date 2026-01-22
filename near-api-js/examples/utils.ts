import { NEAR } from "near-api-js/tokens";
import { USDT } from "near-api-js/tokens/testnet";

// Convert NEAR amount into yoctoNEAR
const amountInYoctoNear: bigint = NEAR.toUnits("0.1");
console.log(amountInYoctoNear);

// Convert yoctoNEAR amount into NEAR
const amountInNear: string = NEAR.toDecimal("1000000000000000000000000");
console.log(amountInNear);

// convert USDT amount into base units
const amountInUsdtUnits: string = USDT.toUnits("0.1").toString();
console.log(amountInUsdtUnits);

// convert base units into USDT
const amountInUsdt: string = USDT.toDecimal("12300000");
console.log(amountInUsdt);

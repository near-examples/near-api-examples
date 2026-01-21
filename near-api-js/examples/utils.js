import { NEAR } from "near-api-js/tokens";
import { USDT } from "near-api-js/tokens/testnet";
import { yoctoToNear, nearToYocto, gigaToGas, teraToGas } from "near-api-js";

// Convert NEAR amount into yoctoNEAR
const amountInYoctoNear = NEAR.toUnits("0.1");
console.log(amountInYoctoNear);

// Convert yoctoNEAR amount into NEAR
const amountInNear = NEAR.toDecimal("1000000000000000000000000");
console.log(amountInNear);

// convert USDT amount into base units
const amountInUsdtUnits = USDT.toUnits("0.1").toString();
console.log(amountInUsdtUnits);

// convert base units into USDT
const amountInUsdt = USDT.toDecimal("12300000");
console.log(amountInUsdt);

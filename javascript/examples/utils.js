import { parseNearAmount, formatNearAmount } from "@near-js/utils";

// Convert NEAR amount into yoctoNEAR
const amountInYoctoNear = parseNearAmount("0.1");
console.log(amountInYoctoNear);

// Convert yoctoNEAR amount into NEAR
const amountInNear = formatNearAmount("1000000000000000000000000");
console.log(amountInNear);

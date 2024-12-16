import { utils } from "near-api-js";

// Convert NEAR amount into yoctoNEAR
const amountInYoctoNear = utils.format.parseNearAmount("1");
console.log(amountInYoctoNear);

// Convert yoctoNEAR amount into NEAR
const amountInNear = utils.format.formatNearAmount("1000000000000000000000000");
console.log(amountInNear);

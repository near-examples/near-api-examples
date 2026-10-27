use near_kit::{Gas, NearToken};

// near-kit re-exports the `near-token` and `near-gas` types
const ONE_NEAR: NearToken = NearToken::from_near(1);

fn main() {
    // Convert from NEAR into type NearToken as yoctoNEAR
    let from_near = NearToken::from_near(1);
    println!("{from_near:?}");

    // Convert from milliNEAR into type NearToken as yoctoNEAR
    let from_milli = NearToken::from_millinear(1000);
    println!("{from_milli:?}");

    // Convert from yoctoNEAR into type NearToken as yoctoNEAR
    let yocto_to_yocto = NearToken::from_yoctonear(1_000_000_000_000_000_000_000_000);
    println!("{yocto_to_yocto:?}");

    // Convert from type NearToken into u128 as NEAR, milliNEAR and yoctoNEAR
    println!("{}", ONE_NEAR.as_near());
    println!("{}", ONE_NEAR.as_millinear());
    println!("{}", ONE_NEAR.as_yoctonear());

    // Display as NEAR or yoctoNEAR depending on the amount
    println!("{}", ONE_NEAR.exact_amount_display());

    // Gas works the same way
    let gas = Gas::from_tgas(30);
    println!("{gas} = {} gas units", gas.as_gas());
}

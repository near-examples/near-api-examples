use near_api::prelude::NearToken;

const ONE_NEAR: NearToken = NearToken::from_near(1);

fn main() {
    // Convert from NEAR into type NearToken as yoctoNEAR
    let from_near = NearToken::from_near(1);
    println!("{:?}", from_near);

    // Convert from milliNEAR into type NearToken as yoctoNEAR
    let from_milli = NearToken::from_millinear(1000);
    println!("{:?}", from_milli);

    // Convert from yoctoNEAR into type NearToken as yoctoNEAR
    let yocto_to_yocto = NearToken::from_yoctonear(1_000_000_000_000_000_000_000_000);
    println!("{:?}", yocto_to_yocto);

    // Convert from type NearToken into type u128 as NEAR
    let as_near = NearToken::as_near(&ONE_NEAR);
    println!("{:?}", as_near);

    // Convert from type NearToken into type u128 as milliNEAR
    let as_milli = NearToken::as_millinear(&ONE_NEAR);
    println!("{:?}", as_milli);

    // Convert from type NearToken into type u128 as yoctoNEAR
    let as_yocto = NearToken::as_yoctonear(&ONE_NEAR);
    println!("{:?}", as_yocto);

    // Convert from type NearToken into type String
    // as NEAR or yoctoNEAR depending on the amount
    let display_amount = NearToken::exact_amount_display(&ONE_NEAR);
    println!("{:?}", display_amount);
}

use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Batch multiple actions in one atomic transaction to the same receiver
    let outcome = near
        .transaction("counter.near-examples.testnet")
        .call("increment")
        .gas(Gas::from_tgas(30))
        .finish()
        .transfer(NearToken::from_millinear(1))
        .send()
        .await?;

    println!("Batch actions result: {:?}", outcome.transaction_hash());

    Ok(())
}

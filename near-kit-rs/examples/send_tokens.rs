use near_kit::{Error, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Send NEAR tokens to another account
    let outcome = near
        .transfer("receiver-account.testnet", NearToken::from_millinear(100))
        .await?;

    println!("Transfer result: {:?}", outcome.transaction_hash());

    Ok(())
}

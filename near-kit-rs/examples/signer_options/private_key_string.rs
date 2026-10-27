use near_kit::signer::InMemorySigner;
use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a signer from a private key string
    let signer = InMemorySigner::new(&account_id, &private_key)?; // ed25519:5Fg2...
    let near = Near::testnet().signer(signer).build();

    // Test the signer by transferring NEAR
    near.transfer("receiver-account.testnet", NearToken::from_near(1)).await?;

    Ok(())
}

use near_kit::signer::InMemorySigner;
use near_kit::{Error, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenvy::from_filename("../.env").ok();
    let seed_phrase = std::env::var("SEED_PHRASE").expect("SEED_PHRASE");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a signer from a seed phrase (requires the `mnemonic` feature)
    let signer = InMemorySigner::from_seed_phrase(&account_id, &seed_phrase)?; // "royal success river ..."
    let near = Near::testnet().signer(signer).build();

    // Test the signer by transferring NEAR
    near.transfer("receiver-account.testnet", NearToken::from_near(1)).await?;

    Ok(())
}

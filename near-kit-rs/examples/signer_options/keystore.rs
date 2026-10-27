use near_kit::signer::KeyringSigner;
use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenvy::from_filename("../.env").ok();
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // The keyring stores one entry per key, so look up which keys the account has
    let keys = Near::testnet().build().access_keys(&account_id).await?;
    let public_key = keys.keys[0].public_key.to_string();

    // Load the key from the system keyring, as saved by the NEAR CLI (requires the `keyring` feature)
    let signer = KeyringSigner::new("testnet", &account_id, &public_key)?;
    let near = Near::testnet().signer(signer.into_inner()).build();

    // Test the signer by transferring NEAR
    near.transfer("receiver-account.testnet", NearToken::from_near(1)).await?;

    Ok(())
}

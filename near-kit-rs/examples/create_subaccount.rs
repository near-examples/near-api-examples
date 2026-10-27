use near_kit::signer::SecretKey;
use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Generate a new key pair for the subaccount
    let key = SecretKey::generate_ed25519();

    // Create a unique subaccount name using the timestamp
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let new_account_id = format!("{timestamp}.{account_id}");

    // Create the subaccount, fund it and add a key in one atomic transaction
    near.transaction(&new_account_id)
        .create_account()
        .transfer(NearToken::from_millinear(100))
        .add_full_access_key(key.public_key())
        .send()
        .await?;

    println!("Created subaccount: {new_account_id}");
    println!("Private key: {key}");

    Ok(())
}

use near_kit::signer::SecretKey;
use near_kit::{Error, Gas, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet()
        .credentials(&private_key, &account_id)?
        .build();

    // Generate a new key pair for the top-level account
    let key = SecretKey::generate_ed25519();

    // Create a unique top-level account name using the timestamp
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let new_account_id = format!("{timestamp}.testnet");

    // Create the top-level account by calling the testnet contract
    near.call("testnet", "create_account")
        .args(serde_json::json!({
            "new_account_id": new_account_id,
            "new_public_key": key.public_key().to_string(),
        }))
        .deposit(NearToken::from_millinear(100))
        .gas(Gas::from_tgas(30))
        .await?;

    println!("Created top-level account: {new_account_id}");
    println!("Private key: {key}");

    Ok(())
}

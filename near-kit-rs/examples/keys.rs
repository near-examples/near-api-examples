use near_kit::signer::{InMemorySigner, SecretKey};
use near_kit::{Error, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // List all access keys of the account
    let keys = near.access_keys(&account_id).await?;
    println!("Account has {} keys", keys.keys.len());

    // Generate new key pairs
    let full_access_key = SecretKey::generate_ed25519();
    let function_call_key = SecretKey::generate_ed25519();

    // Add a Full Access Key
    near.add_full_access_key(full_access_key.public_key())
        .send()
        .await?;
    println!("Added Full Access Key: {}", full_access_key.public_key());

    // Add a Function Call Access Key
    near.transaction(&account_id)
        .add_function_call_key(
            function_call_key.public_key(),
            "example-contract.testnet",             // contract this key is allowed to call
            vec!["example_method".to_string()],     // methods it can call (empty = all)
            Some(NearToken::from_millinear(250)),   // gas allowance (None = unlimited)
        )
        .send()
        .await?;
    println!("Added Function Call Key: {}", function_call_key.public_key());

    // Use the new Full Access Key to delete the Function Call Key
    let near_with_new_key = near.with_signer(InMemorySigner::from_secret_key(
        account_id.as_str(),
        full_access_key.clone(),
    )?);
    near_with_new_key
        .delete_key(function_call_key.public_key())
        .send()
        .await?;
    println!("Deleted Function Call Key: {}", function_call_key.public_key());

    // Delete the Full Access Key we added (using the original signer)
    near.delete_key(full_access_key.public_key()).send().await?;
    println!("Deleted Full Access Key: {}", full_access_key.public_key());

    Ok(())
}

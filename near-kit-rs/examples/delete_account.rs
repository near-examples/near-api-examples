use near_kit::signer::{InMemorySigner, SecretKey};
use near_kit::transaction::Final;
use near_kit::{Error, Near, NearToken};

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

    // Create a subaccount that we will delete afterwards
    let key = SecretKey::generate_ed25519();
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let account_to_delete = format!("{timestamp}.{account_id}");

    near.transaction(&account_to_delete)
        .create_account()
        .transfer(NearToken::from_millinear(10))
        .add_full_access_key(key.public_key())
        .send()
        .wait_until::<Final>()
        .await?;
    println!("Created account: {account_to_delete}");

    // Sign as the new account, reusing the same RPC connection
    let new_account = near.with_signer(InMemorySigner::from_secret_key(
        account_to_delete.as_str(),
        key,
    )?);

    // Delete the account, sending the remaining balance to the beneficiary
    new_account
        .transaction(&account_to_delete)
        .delete_account(&account_id)
        .send()
        .await?;

    println!("Deleted account: {account_to_delete}");
    println!("Beneficiary: {account_id}");

    Ok(())
}

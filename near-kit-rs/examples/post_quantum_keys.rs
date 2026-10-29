use near_kit::signer::{InMemorySigner, SecretKey};
use near_kit::transaction::Final;
use near_kit::{Error, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Use an existing testnet account and its full-access key.
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");
    let near = Near::testnet()
        .credentials(&private_key, &account_id)?
        .build();

    // Generate an ML-DSA-65 key and register it using the existing signer.
    let pq_key = SecretKey::generate_ml_dsa65();
    let public_key = pq_key.public_key();
    near.add_full_access_key(public_key.clone())
        .send()
        .wait_until::<Final>()
        .await?;
    println!("Added post-quantum key: {public_key}");

    let pq_near = near.with_signer(InMemorySigner::from_secret_key(
        account_id.as_str(),
        pq_key,
    )?);
    // Sign a self-transfer with the post-quantum key. This transaction pays gas.
    let transfer_result = pq_near
        .transfer(account_id.as_str(), NearToken::from_millinear(1))
        .await;

    // Remove the temporary key using the original signer, even if the transfer failed.
    near.delete_key(public_key.clone())
        .send()
        .wait_until::<Final>()
        .await?;
    println!("Removed post-quantum key: {public_key}");
    transfer_result?;
    println!("Post-quantum self-transfer completed");
    Ok(())
}

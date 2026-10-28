use near_kit::protocol::PublishMode;
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
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Read the contract WASM
    let wasm_code = std::fs::read("../contracts/contract.wasm").expect("contract.wasm");

    // Publish as a global contract identified by the account ID.
    // Other accounts can use this contract without deploying their own copy,
    // and re-publishing from this account updates all of them.
    let outcome = near
        .publish(wasm_code, PublishMode::Updatable)
        .send()
        .wait_until::<Final>()
        .await?;
    println!("Published global contract: {:?}", outcome.transaction_hash());

    // Create a consumer account that will use the global contract
    let consumer_key = SecretKey::generate_ed25519();
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let consumer_account_id = format!("{timestamp}.{account_id}");

    near.transaction(&consumer_account_id)
        .create_account()
        .transfer(NearToken::from_millinear(100))
        .add_full_access_key(consumer_key.public_key())
        .send()
        .wait_until::<Final>()
        .await?;
    println!("Created consumer account: {consumer_account_id}");

    // The consumer uses the global contract by referencing the publisher's account ID
    let consumer = near.with_signer(InMemorySigner::from_secret_key(
        consumer_account_id.as_str(),
        consumer_key,
    )?);

    consumer.deploy_from(&account_id).send().await?;
    println!("Consumer is now using the global contract from: {account_id}");

    // Clean up: delete the consumer account
    consumer
        .transaction(&consumer_account_id)
        .delete_account(&account_id)
        .send()
        .await?;
    println!("Cleaned up consumer account");

    Ok(())
}

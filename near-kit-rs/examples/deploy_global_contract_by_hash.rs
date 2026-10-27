use near_kit::protocol::PublishMode;
use near_kit::signer::{InMemorySigner, SecretKey};
use near_kit::transaction::Final;
use near_kit::{CryptoHash, Error, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Read the contract WASM and compute its code hash
    let wasm_code = std::fs::read("../contracts/contract.wasm").expect("contract.wasm");
    let code_hash = CryptoHash::hash(&wasm_code);

    // Publish as a global contract identified by its code hash (immutable)
    let outcome = near
        .publish(wasm_code, PublishMode::Immutable)
        .send()
        .wait_until::<Final>()
        .await?;
    println!("Published global contract by hash: {:?}", outcome.transaction_hash());

    // Create a consumer account
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

    // The consumer uses the global contract by referencing the code hash
    let consumer = near.with_signer(InMemorySigner::from_secret_key(
        consumer_account_id.as_str(),
        consumer_key,
    )?);

    consumer.deploy_from(code_hash).send().await?;
    println!("Consumer is now using the global contract {code_hash}");

    // Clean up: delete the consumer account
    consumer
        .transaction(&consumer_account_id)
        .delete_account(&account_id)
        .send()
        .await?;
    println!("Cleaned up consumer account");

    Ok(())
}

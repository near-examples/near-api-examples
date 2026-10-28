use near_kit::{Error, Near};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Create a connection to testnet (no signing needed for view operations)
    let near = Near::testnet().build();
    let account_id = "example-account.testnet";

    // Get the account balance
    let balance = near.balance(account_id).await?;
    println!("Account: {account_id}");
    println!("Available: {}, staked: {}", balance.available, balance.locked);

    // Get the account state: code hash and storage usage
    let account = near.account(account_id).await?;
    println!("Code hash: {}", account.code_hash);
    println!("Storage usage: {} bytes", account.storage_usage);

    Ok(())
}

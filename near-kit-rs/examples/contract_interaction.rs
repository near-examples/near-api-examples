use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Read-only calls do not need a signer
    let total: u32 = near
        .view("guestbook.near-examples.testnet", "total_messages")
        .await?;
    println!("Total messages: {total}");

    let messages: Vec<serde_json::Value> = near
        .view("guestbook.near-examples.testnet", "get_messages")
        .args(serde_json::json!({ "from_index": "0", "limit": "10" }))
        .await?;
    println!("Messages: {messages:#?}");

    // To modify state, call the contract method
    near.call("guestbook.near-examples.testnet", "add_message")
        .args(serde_json::json!({ "text": "Hello!" }))
        .gas(Gas::from_tgas(30))
        .await?;

    Ok(())
}

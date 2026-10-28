use near_kit::{Error, Gas, Near};

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

    // Prepare the transactions
    let tx1 = near
        .call("guestbook.near-examples.testnet", "add_message")
        .args(serde_json::json!({ "text": "Hello, world!" }))
        .gas(Gas::from_tgas(30));
    let tx2 = near
        .call("counter.near-examples.testnet", "increment")
        .gas(Gas::from_tgas(30));

    // Send them at the same time: the client reserves a distinct nonce for each
    let (r1, r2) = tokio::try_join!(tx1, tx2)?;

    println!("Guestbook tx: {:?}", r1.transaction_hash());
    println!("Counter tx: {:?}", r2.transaction_hash());

    Ok(())
}

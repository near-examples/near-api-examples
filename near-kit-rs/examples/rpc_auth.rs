use near_kit::{Error, Near};

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load .env from the repo root (one level up from the near-kit-rs directory)
    dotenvy::from_filename("../.env").ok();

    // Replace with your own API key, or set FASTNEAR_API_KEY in .env
    let api_key = std::env::var("FASTNEAR_API_KEY").unwrap_or_else(|_| {
        "1111111111111111111111111111111111111111111111111111111111111111".to_string()
    });

    // Authenticate via query parameter appended to the RPC URL
    let rpc_url = format!("https://rpc.mainnet.fastnear.com?apiKey={api_key}");
    let near = Near::custom(rpc_url, "mainnet").build();

    println!("Using authenticated FastNear RPC");

    // Query an account balance to verify the connection
    let balance = near.balance("root.near").await?;
    println!("Balance: {}", balance.available);

    Ok(())
}

use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to a custom RPC endpoint; the chain ID tells the client which network it is
    let near = Near::custom("https://test.rpc.fastnear.com", "testnet").build();

    // Test the connection by fetching the balance of an account
    let balance = near.balance("my-new-account.testnet").await?;
    println!("Balance: {}", balance.available);

    Ok(())
}

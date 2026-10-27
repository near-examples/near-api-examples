use near_api::{AccountId, NetworkConfig, RPCEndpoint, Tokens};

#[tokio::main]
async fn main() {
    // Load .env from the repo root (one level up from the rust directory)
    dotenv::from_filename("../.env").ok();

    // Replace with your own API key, or set FASTNEAR_API_KEY in .env
    let api_key = std::env::var("FASTNEAR_API_KEY")
        .unwrap_or_else(|_| "1111111111111111111111111111111111111111111111111111111111111111".to_string());

    // Authenticate via query parameter appended to the RPC URL
    let rpc_url = format!("https://rpc.mainnet.fastnear.com?apiKey={}", api_key);

    let my_rpc_endpoint = RPCEndpoint::new(rpc_url.parse().unwrap());
    let network = NetworkConfig {
        network_name: "mainnet".to_string(),
        rpc_endpoints: vec![my_rpc_endpoint],
        linkdrop_account_id: Some("near".parse().unwrap()),
        near_social_db_contract_account_id: Some("social.near".parse().unwrap()),
        faucet_url: None,
        meta_transaction_relayer_url: None,
        fastnear_url: None,
        staking_pools_factory_account_id: Some("poolv1.near".parse().unwrap()),
    };

    println!("Using authenticated FastNear RPC");

    // Query account balance to verify the connection
    let account_id: AccountId = "root.near".parse().unwrap();
    let near_balance = Tokens::account(account_id)
        .near_balance()
        .fetch_from(&network)
        .await
        .unwrap();

    println!("{:?}", near_balance);
}

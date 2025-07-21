use near_api::{AccountId, NetworkConfig, RPCEndpoint, Tokens};

#[tokio::main]
async fn main() {
    // Connecting to NEAR
    let my_rpc_endpoint = RPCEndpoint::new("https://test.rpc.fastnear.com".parse().unwrap());
    let network = NetworkConfig {
        network_name: "testnet".to_string(),
        rpc_endpoints: vec![my_rpc_endpoint],
        linkdrop_account_id: Some("testnet".parse().unwrap()),
        near_social_db_contract_account_id: Some("v1.social08.testnet".parse().unwrap()),
        faucet_url: Some("https://helper.nearprotocol.com/account".parse().unwrap()),
        meta_transaction_relayer_url: Some("http://localhost:3030/relay".parse().unwrap()),
        fastnear_url: None,
        staking_pools_factory_account_id: Some("pool.f863973.m0".parse().unwrap()),
    };

    // Test connection by fetching the balance of an account
    let my_account_id: AccountId = "my-new-account.testnet".parse().unwrap();
    let _near_balance = Tokens::account(my_account_id.clone())
        .near_balance()
        .fetch_from(&network)
        .await
        .unwrap();

    println!("{:?}", _near_balance);
}

use near_api::prelude::{Account, AccountId, NetworkConfig, Tokens};

#[tokio::main]
async fn main() {
    let my_account_id: AccountId = "example-account.testnet".parse().unwrap();
    // Create an account object
    let my_account = Account(my_account_id.clone());

    // Create a connection to the NEAR testnet
    let network = NetworkConfig::testnet();

    // Gets the available, and staked balance in yoctoNEAR
    let near_balance = Tokens::of(my_account_id.clone())
        .near_balance()
        .fetch_from(&network)
        .await
        .unwrap();
    println!("{:?}", near_balance);

    // Account's state, including its code_hash and storage usage
    let account_info = my_account.view().fetch_from(&network).await.unwrap();
    println!("{:?}", account_info);
}

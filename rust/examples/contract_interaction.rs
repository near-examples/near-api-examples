use dotenv::from_filename;
use near_api::{AccountId, Contract, Data, NearToken, NetworkConfig, Signer};
use near_crypto::SecretKey;
use serde_json::json;
use std::str::FromStr;

#[tokio::main]
async fn main() {
    // Load environment variables
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let signer = Signer::new(Signer::from_secret_key(private_key)).unwrap();

    // Create a connection to the NEAR testnet
    let network = NetworkConfig::testnet();

    // Create contract object
    let contract_id: AccountId = "guestbook.near-examples.testnet".parse().unwrap();
    let contract = Contract(contract_id.clone());

    // Make a view call to a contract
    let view_call_result: Data<u32> = contract
        .call_function("total_messages", ())
        .unwrap()
        .read_only()
        .fetch_from(&network)
        .await
        .unwrap();
    println!("{:?}", view_call_result.data);

    // Make a function call to a contract
    let args = json!({
        "text": "Hello, world!"
    });

    let function_call_result = contract
        .call_function("add_message", args)
        .unwrap()
        .transaction()
        .deposit(NearToken::from_near(1))
        .with_signer(account_id.clone(), signer.clone()) // Signer is the account that is calling the function
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", function_call_result);

    // Deploy a contract to an account
    // Set up a contract object
    let deploy_result = Contract::deploy(account_id.clone())
        .use_code(include_bytes!("../../contracts/contract.wasm").to_vec()) // Path of contract WASM relative to this file
        .without_init_call()
        .with_signer(signer) // Signer is the account that is deploying the contract
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", deploy_result);
}

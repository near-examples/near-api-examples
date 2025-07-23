use dotenv::from_filename;
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};
use near_api::*;
use near_crypto::SecretKey;
use near_primitives::views::FinalExecutionOutcomeView;

/// Example deploying a contract to the global contract code storage as hash
#[tokio::main]
async fn main() {
    // Load environment variables
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();
    let private_key = SecretKey::from_str(&private_key_string).unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();
    let code = std::fs::read("../contracts/contract.wasm").unwrap();
    let signer = Signer::new(Signer::from_secret_key(private_key)).unwrap();

    // Deploy the global contract code using a hash
    // This will deploy the contract to the global contract hash
    // and return the final execution outcome
    let result: FinalExecutionOutcomeView = Contract::deploy_global_contract_code(code)
        .as_hash()
        .with_signer(account_id.clone(), signer.clone())
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);

    // Deployed global contract's hash
    let account_info = Account(account_id.clone()).view().fetch_from_testnet().await.unwrap();
    let global_hash = account_info.data.global_contract_hash;
    println!("Global contract hash: {:?}", global_hash);

    // Create a .testnet account with private key
    // Generate a new account ID based on the current timestamp
    let new_account_id: AccountId = format!(
        "{}.testnet",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
    )
    .parse()
    .unwrap();

    let private_key = signer::generate_secret_key().unwrap();
    let create_account_result = Account::create_account(new_account_id.clone())
        .fund_myself(
            account_id.clone(),
            NearToken::from_millinear(100), // Initial balance for new account in yoctoNEAR
        )
        .public_key(private_key.public_key()).unwrap()
        .with_signer(signer.clone()) // Signer is the account that is creating the new account
        .send_to_testnet()
        .await
        .unwrap();

    println!("{:?}", create_account_result);

    // Prepare a transaction to deploy a contract to the provided account using an immutable hash reference to the code from the global contract code storage.
    let my_signer = Signer::new(Signer::from_secret_key(private_key)).unwrap();

    let result: FinalExecutionOutcomeView = Contract::deploy(new_account_id)
        .use_global_hash(global_hash.unwrap().into())
        .without_init_call()
        .with_signer(my_signer)
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);
}

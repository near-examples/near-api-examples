use dotenv::from_filename;
use std::str::FromStr;
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
        .with_signer(account_id, signer)
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);

    // Prepare a transaction to deploy a contract to the provided account using an immutable hash reference to the code from the global contract code storage.
    let global_hash: types::CryptoHash = "DxfRbrjT3QPmoANMDYTR6iXPGJr7xRUyDnQhcAWjcoFF".parse().unwrap();
    let my_account_id: AccountId = "my-contract.testnet".parse().unwrap();
    let my_signer = Signer::new(Signer::from_ledger()).unwrap();

    let result: FinalExecutionOutcomeView = Contract::deploy(my_account_id)
        .use_global_hash(global_hash)
        .without_init_call()
        .with_signer(my_signer)
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);

}

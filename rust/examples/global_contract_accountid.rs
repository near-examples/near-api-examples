use dotenv::from_filename;
use std::str::FromStr;
use near_api::*;
use near_crypto::SecretKey;
use near_primitives::views::FinalExecutionOutcomeView;

/// Example deploying a contract to the global contract code storage as account-id
#[tokio::main]
async fn main() {
    // Load environment variables
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();
    let private_key = SecretKey::from_str(&private_key_string).unwrap();

    let global_account_id: AccountId = account_id_string.parse().unwrap();
    let global_code = std::fs::read("../contracts/contract.wasm").unwrap();
    let global_signer = Signer::new(Signer::from_secret_key(private_key)).unwrap();

    // Deploy the global contract code using the account ID `nft-contract.testnet`
    // This will deploy the contract to the specified account ID
    // and return the final execution outcome
    let result: FinalExecutionOutcomeView = Contract::deploy_global_contract_code(global_code)
        .as_account_id(global_account_id.clone())
        .with_signer(global_signer)
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);

    // Prepare a transaction to deploy a contract to the provided account using a mutable account-id reference to the code from the global contract code storage.
    // This is useful for deploying contracts that are meant to be used by multiple accounts or for creating a contract that can be updated later.
    //
    // Please note that you have to trust the account-id that you are providing. As the code is mutable, the owner of the referenced account can
    // change the code at any time which might lead to unexpected behavior or malicious activity.
    let my_account_id: AccountId = "my-contract.testnet".parse().unwrap();
    let my_signer = Signer::new(Signer::from_ledger()).unwrap();

    let result: FinalExecutionOutcomeView = Contract::deploy(my_account_id)
        .use_global_account_id(global_account_id)
        .without_init_call()
        .with_signer(my_signer)
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);
}

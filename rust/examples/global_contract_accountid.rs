use near_api::*;
use near_primitives::views::FinalExecutionOutcomeView;

/// Example deploying a contract to the global contract code storage as account-id
#[tokio::main]
async fn main() {
    let global_account_id: AccountId = "nft-contract.testnet".parse().unwrap();
    let code = std::fs::read("path/to/your/contract.wasm").unwrap();
    let signer = Signer::new(Signer::from_ledger()).unwrap();

    // Deploy the global contract code using the account ID `nft-contract.testnet`
    // This will deploy the contract to the specified account ID
    // and return the final execution outcome
    let result: FinalExecutionOutcomeView = Contract::deploy_global_contract_code(code)
        .as_account_id(global_account_id)
        .with_signer(signer)
        .send_to_testnet()
        .await.unwrap();

    println!("{:?}", result);
}

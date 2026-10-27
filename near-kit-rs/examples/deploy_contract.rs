use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Load environment variables
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a connection to testnet with signing capabilities
    let near = Near::testnet().credentials(&private_key, &account_id)?.build();

    // Deploy a contract to the signer account
    let wasm_code = std::fs::read("../contracts/contract.wasm").expect("contract.wasm");
    let outcome = near.deploy(wasm_code).send().await?;

    println!("Deploy contract result: {:?}", outcome.transaction_hash());

    Ok(())
}

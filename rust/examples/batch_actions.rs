use dotenv::from_filename;
use near_api::types::transaction::actions::{FunctionCallAction, TransferAction};
use near_api::types::Action;
use near_api::SecretKey;
use near_api::{AccountId, NetworkConfig, Signer, Transaction};
use std::str::FromStr;

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let signer = Signer::from_secret_key(private_key).unwrap();

    let network = NetworkConfig::testnet();

    // Send a batch of actions to a single receiver
    // Prepare the actions
    let call_action = Action::FunctionCall(Box::new(FunctionCallAction {
        method_name: "increment".to_string(),
        args: serde_json::json!({}).to_string().into_bytes(),
        gas: near_api::NearGas::from_tgas(30),
        deposit: near_api::NearToken::from_yoctonear(0),
    }));
    let transfer_action = Action::Transfer(TransferAction {
        deposit: near_api::NearToken::from_near(1),
    }); // Transfer 1 NEAR

    // Send the batch of actions
    let batch_actions_result = Transaction::construct(
        account_id.clone(),
        "counter.near-examples.testnet".parse().unwrap(),
    )
    .add_actions(vec![call_action, transfer_action])
    .with_signer(signer)
    .send_to(&network)
    .await
    .unwrap();
    println!("{:?}", batch_actions_result);
}

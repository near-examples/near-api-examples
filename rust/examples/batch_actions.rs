use dotenv::from_filename;
use near_api::{AccountId, NetworkConfig, Signer, Transaction};
use near_crypto::SecretKey;
use near_primitives::action::{FunctionCallAction, TransferAction};
use near_primitives::transaction::Action;
use std::str::FromStr;

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let signer = Signer::new(Signer::from_secret_key(private_key)).unwrap();

    let network = NetworkConfig::testnet();

    // Send a batch of actions to a single receiver
    // Prepare the actions
    let call_action = Action::FunctionCall(Box::new(FunctionCallAction {
        method_name: "increment".to_string(),
        args: vec![],
        gas: 30_000_000_000_000,
        deposit: 0,
    }));
    let transfer_action = Action::Transfer(TransferAction {
        deposit: 1_000_000_000_000_000_000_000_000,
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

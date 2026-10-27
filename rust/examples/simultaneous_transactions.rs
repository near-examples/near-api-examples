use dotenv::from_filename;
use near_api::types::transaction::actions::FunctionCallAction;
use near_api::types::Action;
use near_api::SecretKey;
use near_api::{AccountId, NetworkConfig, Signer, Transaction};
use serde_json::json;
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

    // Send independent transactions simultaneously to different receivers
    // Prepare the transactions
    let args = serde_json::to_vec(&json!({
        "text": "Hello, world!"
    }))
    .unwrap();
    let action1 = Action::FunctionCall(Box::new(FunctionCallAction {
        method_name: "add_message".to_string(),
        args,
        gas: near_api::NearGas::from_tgas(100),
        deposit: near_api::NearToken::from_yoctonear(0),
    }));
    let tx1 = Transaction::construct(
        account_id.clone(),
        "guestbook.near-examples.testnet".parse().unwrap(),
    )
    .add_action(action1)
    .with_signer(signer.clone());

    let action2 = Action::FunctionCall(Box::new(FunctionCallAction {
        method_name: "increment".to_string(),
        args: b"{}".to_vec(),
        gas: near_api::NearGas::from_tgas(100),
        deposit: near_api::NearToken::from_yoctonear(0),
    }));
    let tx2 = Transaction::construct(
        account_id.clone(),
        "counter.near-examples.testnet".parse().unwrap(),
    )
    .add_action(action2)
    .with_signer(signer.clone());

    // Send the transactions simultaneously
    let (tx1_result, tx2_result) = tokio::join!(tx1.send_to(&network), tx2.send_to(&network));
    println!("{:?}", tx1_result);
    println!("{:?}", tx2_result);
}

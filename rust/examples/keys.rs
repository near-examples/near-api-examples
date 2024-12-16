use dotenv::from_filename;
use near_api::prelude::{Account, AccountId, NetworkConfig, Signer};
use near_crypto::SecretKey;
use near_primitives::account::{AccessKeyPermission, FunctionCallPermission};
use std::str::FromStr;

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();
    let account = Account(account_id.clone());

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let signer = Signer::new(Signer::secret_key(private_key)).unwrap();

    let network = NetworkConfig::testnet();

    // Get all access keys for the account
    let keys = account.list_keys().fetch_from(&network).await.unwrap();
    println!("{:?}", keys);

    // Add full access key
    let (new_full_private_key, txn) = account
        .add_key(AccessKeyPermission::FullAccess)
        .new_keypair() // Generate a new keypair
        .generate_secret_key() // Get the private key from the keypair
        .unwrap();

    let new_full_public_key = new_full_private_key.public_key().to_string();
    println!("{:?}", new_full_public_key);

    let add_full_key_result = txn
        .with_signer(signer.clone())
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", add_full_key_result);

    // Add function call access key
    let new_function_call_key = AccessKeyPermission::FunctionCall(FunctionCallPermission {
        allowance: Some(250_000_000_000_000_000_000_000), // Gas allowance key can use to call methods (optional)
        receiver_id: "example-contract.testnet".to_string(), // Contract this key is allowed to call
        method_names: vec!["example_method".to_string()], // Methods this key is allowed to call
    });

    let (new_function_private_key, txn) = account
        .add_key(new_function_call_key)
        .new_keypair()
        .generate_secret_key()
        .unwrap();

    let new_function_public_key = new_function_private_key.public_key().to_string();
    println!("{:?}", new_function_public_key);

    let add_function_key_result = txn
        .with_signer(signer.clone())
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", add_function_key_result);

    // Delete full access key
    let public_key_to_delete = new_full_public_key;
    let delete_full_key_result = account
        .delete_key(public_key_to_delete.parse().unwrap())
        .with_signer(signer.clone())
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", delete_full_key_result);
}

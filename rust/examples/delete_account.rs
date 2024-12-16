use dotenv::from_filename;
use near_api::prelude::{Account, AccountId, NearToken, NetworkConfig, Signer};
use near_crypto::SecretKey;
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let beneficiary_account_id: AccountId = account_id_string.parse().unwrap();

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let creator_signer = Signer::new(Signer::secret_key(private_key)).unwrap();

    let network = NetworkConfig::testnet();

    // First create a new account to be deleted
    // Generate a new account ID based on the current timestamp
    let delete_account_id: AccountId = format!(
        "{}.testnet",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
    )
    .parse()
    .unwrap();

    let (delete_account_private_key, create_account_tx) = Account::create_account()
        .fund_myself(
            delete_account_id.clone(),
            beneficiary_account_id.clone(),
            NearToken::from_millinear(100),
        )
        .new_keypair()
        .generate_secret_key()
        .unwrap();

    create_account_tx
        .with_signer(creator_signer.clone()) // Signer is the account that is creating the new account
        .send_to(&network)
        .await
        .unwrap();

    // Create an account object for the new account
    // and a new signer
    let account_to_delete = Account(delete_account_id.clone());
    let signer = Signer::new(Signer::secret_key(delete_account_private_key)).unwrap();

    // Delete the account with account Id of the account object
    let delete_account_result = account_to_delete
        .delete_account_with_beneficiary(beneficiary_account_id.clone()) // example-beneficiary.testnet
        .with_signer(signer.clone()) // Signer is the account that is being deleted
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", delete_account_result);
}

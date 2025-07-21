use dotenv::from_filename;
use near_api::{signer, Account, AccountId, NearToken, NetworkConfig, Signer};
use near_crypto::SecretKey;
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let private_key_string = std::env::var("PRIVATE_KEY").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let signer = Signer::new(Signer::from_secret_key(private_key)).unwrap();

    let network = NetworkConfig::testnet();

    // Create a .testnet account with seed phrase
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

    let (seed_phrase, seed_pk) = signer::generate_seed_phrase().unwrap();
    let create_account_result = Account::create_account(new_account_id.clone()) // example-account.testnet
        .fund_myself(
            account_id.clone(),
            NearToken::from_millinear(100), // Initial balance for new account in yoctoNEAR
        )
        .public_key(seed_pk).unwrap()
        .with_signer(signer.clone()) // Signer is the account that is creating the new account
        .send_to(&network)
        .await
        .unwrap();

    println!("Seed phrase: {:?}", seed_phrase);
    println!("{:?}", create_account_result);
}

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

    let account_id: AccountId = account_id_string.parse().unwrap();

    let private_key = SecretKey::from_str(&private_key_string).unwrap();
    let signer = Signer::new(Signer::secret_key(private_key)).unwrap();

    let network = NetworkConfig::testnet();

    // Create a .testnet account with private key
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

    let (private_key, create_account_tx) = Account::create_account()
        .fund_myself(
            new_account_id.clone(), // example-account.testnet
            account_id.clone(),
            NearToken::from_millinear(100), // Initial balance for new account in yoctoNEAR
        )
        .new_keypair()
        .generate_secret_key()
        .unwrap();

    println!("Private key: {:?}", private_key.to_string());
    println!("Public key: {:?}", private_key.public_key().to_string());

    let create_account_result = create_account_tx
        .with_signer(signer.clone()) // Signer is the account that is creating the new account
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", create_account_result);

    // Create a sub account
    // Generate a new sub account ID based on the current timestamp
    let sub_account_id: AccountId = format!(
        "{}.{}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis(),
        account_id
    )
    .parse()
    .unwrap();

    let (private_key, create_sub_account_tx) = Account::create_account()
        .fund_myself(
            sub_account_id.clone(), // sub.example-account.testnet
            account_id.clone(),
            NearToken::from_millinear(100), // Initial balance for sub account in yoctoNEAR
        )
        .new_keypair()
        .generate_secret_key()
        .unwrap();

    println!("Private key: {:?}", private_key.to_string());
    println!("Public key: {:?}", private_key.public_key().to_string());

    let create_sub_account_result = create_sub_account_tx
        .with_signer(signer.clone()) // Signer is the account that is creating the sub account
        .send_to(&network)
        .await
        .unwrap();
    println!("{:?}", create_sub_account_result);
}

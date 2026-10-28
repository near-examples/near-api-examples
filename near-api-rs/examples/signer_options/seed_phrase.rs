use dotenv::from_filename;
use near_api::{AccountId, NearToken, NetworkConfig, Signer, Tokens};

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let seed_phrase_string = std::env::var("SEED_PHRASE").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    // Create a signer from a seed phrase
    let seed_phrase = Signer::from_seed_phrase(&seed_phrase_string, None).unwrap(); // "royal success river ..."
    let signer = Signer::new(seed_phrase).unwrap(); // Create the signer

    let network = NetworkConfig::testnet();

    let account_id: AccountId = account_id_string.parse().unwrap();

    // Test the signer by transferring NEAR
    Tokens::account(account_id.clone()) // example-account.testnet
        .send_to("receiver-account.testnet".parse().unwrap())
        .near(NearToken::from_near(1))
        .with_signer(signer.clone())
        .send_to(&network)
        .await
        .unwrap()
        .assert_success();
}

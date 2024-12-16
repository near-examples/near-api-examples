use dotenv::from_filename;
use near_api::prelude::{AccountId, NearToken, NetworkConfig, Signer, Tokens};
use near_api::signer::keystore::KeystoreSigner;

#[tokio::main]
async fn main() {
    from_filename("../.env").unwrap();
    let account_id_string = std::env::var("ACCOUNT_ID").unwrap();

    let account_id: AccountId = account_id_string.parse().unwrap();

    let network = NetworkConfig::testnet();

    // Create a signer from the encrypted keystore
    let signer = KeystoreSigner::search_for_keys(account_id.clone(), &network)
        .await
        .unwrap(); // Search for the correct keys
    let signer = Signer::new(signer).unwrap(); // Create the signer

    // Test the signer by transferring NEAR
    Tokens::of(account_id.clone()) // example-account.testnet
        .send_to("receiver-account.testnet".parse().unwrap())
        .near(NearToken::from_near(1))
        .with_signer(signer.clone())
        .send_to(&network)
        .await
        .unwrap()
        .assert_success();
}

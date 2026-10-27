use near_kit::signer::FileSigner;
use near_kit::{Error, Near, NearToken};

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenvy::from_filename("../.env").ok();
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Load the key from the legacy credentials directory (requires the `file-signer` feature)
    // Reads ~/.near-credentials/testnet/<account_id>.json
    let signer = FileSigner::new("testnet", &account_id)?;
    let near = Near::testnet().signer(signer.into_inner()).build();

    // Test the signer by transferring NEAR
    near.transfer("receiver-account.testnet", NearToken::from_near(1)).await?;

    Ok(())
}

use near_kit::signer::FileSigner;
use near_kit::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenvy::from_filename("../.env").ok();
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");

    // Create a signer from a credentials file (requires the `file-signer` feature)
    // The file needs a `private_key` field, as written by the NEAR CLI
    let signer = FileSigner::from_file("../credentials-file.json", &account_id)?;
    let near = Near::testnet().signer(signer.into_inner()).build();

    // Test the signer by transferring NEAR
    near.transfer("receiver-account.testnet", NearToken::from_near(1)).await?;

    Ok(())
}

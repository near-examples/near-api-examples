use near_kit::{
    standards::nep413::{self, SignMessageParams, SignedMessage},
    Error, Near,
};

// Verify the original challenge stored by the application, not client-supplied parameters.
async fn verify_wallet_message(
    signed: &SignedMessage,
    challenge: &SignMessageParams,
) -> Result<bool, Error> {
    let near = Near::testnet().build();
    // Checks the signature, timestamp-nonce expiry, account ownership, and FullAccess permission.
    nep413::verify(signed, challenge, &near, Default::default()).await
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenvy::from_filename("../.env").ok();
    let private_key = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY");
    let account_id = std::env::var("ACCOUNT_ID").expect("ACCOUNT_ID");
    let signer = Near::testnet()
        .credentials(&private_key, &account_id)?
        .build();

    let challenge = SignMessageParams {
        message: "Login to MyApp".to_string(),
        recipient: "myapp.com".to_string(),
        nonce: nep413::generate_nonce(),
        callback_url: None,
        state: None,
    };

    // Sign locally for this runnable demo; a web application gets this response from wallet.signMessage.
    // Authentication services must store the original challenge and reject reused challenges.
    let signed = signer.sign_message(challenge.clone()).await?;
    let is_valid = verify_wallet_message(&signed, &challenge).await?;
    println!("Signature valid: {is_valid}");
    Ok(())
}

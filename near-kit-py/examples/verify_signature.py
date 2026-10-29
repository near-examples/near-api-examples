import os

from dotenv import load_dotenv
from near import AccessKeyNotFoundError, Near, SignedMessage, generate_nonce, verify_message


# Verify the original challenge stored by the application, not client-supplied parameters.
def verify_wallet_message(
    signed: SignedMessage, message: str, recipient: str, nonce: bytes
) -> bool:
    if not verify_message(signed, message, recipient, nonce):
        return False

    # Signature verification alone does not prove account ownership.
    client = Near(network="testnet")
    try:
        key = client.access_key(signed.account_id, signed.public_key)
    except AccessKeyNotFoundError:
        return False
    return key.permission == "FullAccess"


def main() -> None:
    load_dotenv("../.env")
    signer = Near(
        network="testnet",
        account_id=os.environ["ACCOUNT_ID"],
        private_key=os.environ["PRIVATE_KEY"],
    )
    message = "Login to MyApp"
    recipient = "myapp.com"
    nonce = generate_nonce()

    # Sign locally for this runnable demo; a web application gets this response from wallet.signMessage.
    # Authentication services must store the original challenge and reject reused challenges.
    signed = signer.sign_message(message, recipient, nonce=nonce)
    print(f"Signature valid: {verify_wallet_message(signed, message, recipient, nonce)}")


if __name__ == "__main__":
    main()

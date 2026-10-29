import os

from dotenv import load_dotenv
from near import KeyPairSigner, MlDsa65KeyPair, Near, add_full_access_key, delete_key


def main() -> None:
    # Use an existing testnet account and its full-access key.
    load_dotenv("../.env")
    account_id = os.environ["ACCOUNT_ID"]
    client = Near(network="testnet", account_id=account_id, private_key=os.environ["PRIVATE_KEY"])

    # Generate an ML-DSA-65 key and register it using the existing signer.
    pq_key = MlDsa65KeyPair.generate()
    client.send_transaction(
        account_id, actions=[add_full_access_key(pq_key.public_key)], wait_until="FINAL"
    )
    print(f"Added post-quantum key: {pq_key.public_key}")

    try:
        pq_client = Near(network="testnet", signer=KeyPairSigner(account_id, pq_key))
        # Sign a self-transfer with the post-quantum key. This transaction pays gas.
        pq_client.send(account_id, "0.001 NEAR")
        print("Post-quantum self-transfer completed")
    finally:
        # Remove the temporary key using the original signer.
        client.send_transaction(account_id, actions=[delete_key(pq_key.public_key)])
        print(f"Removed post-quantum key: {pq_key.public_key}")


if __name__ == "__main__":
    main()

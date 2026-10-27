import os
import time

from dotenv import load_dotenv
from near import (
    KeyPairSigner,
    Near,
    add_full_access_key,
    create_account,
    delete_account,
    generate_key,
    publish_contract,
    transfer,
    use_global_contract,
)

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Read the contract WASM
with open("../contracts/contract.wasm", "rb") as f:
    wasm_code = f.read()

# Publish as a global contract identified by the account ID.
# Other accounts can use this contract without deploying their own copy,
# and re-publishing from this account updates all of them.
result = client.send_transaction(account_id, actions=[publish_contract(wasm_code)])
print(f"Published global contract: {result.transaction_hash}")

# Create a consumer account that will use the global contract
consumer_key = generate_key()
consumer_account_id = f"{int(time.time() * 1000)}.{account_id}"

client.send_transaction(
    consumer_account_id,
    actions=[create_account(), transfer("0.1 NEAR"), add_full_access_key(consumer_key.public_key)],
    wait_until="FINAL",
)
print(f"Created consumer account: {consumer_account_id}")

# The consumer uses the global contract by referencing the publisher's account ID
consumer = client.with_signer(KeyPairSigner(consumer_account_id, consumer_key))
consumer.send_transaction(consumer_account_id, actions=[use_global_contract(account_id=account_id)])
print(f"Consumer is now using the global contract from: {account_id}")

# Clean up: delete the consumer account
consumer.send_transaction(consumer_account_id, actions=[delete_account(account_id)])
print("Cleaned up consumer account")

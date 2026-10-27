import os

from dotenv import load_dotenv
from near import (
    KeyPairSigner,
    Near,
    add_full_access_key,
    add_function_call_key,
    delete_key,
    generate_key,
)

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# List all access keys of the account
keys = client.access_keys(account_id)
print(f"Account has {len(keys)} keys")

# Generate new key pairs
full_access_key = generate_key()
function_call_key = generate_key()

# Add a Full Access Key
client.send_transaction(account_id, actions=[add_full_access_key(full_access_key.public_key)])
print(f"Added Full Access Key: {full_access_key.public_key}")

# Add a Function Call Access Key
client.send_transaction(
    account_id,
    actions=[
        add_function_call_key(
            function_call_key.public_key,
            "example-contract.testnet",  # contract this key is allowed to call
            ["example_method"],  # methods it can call (optional, empty = all)
            allowance="0.25 NEAR",  # gas allowance (optional)
        )
    ],
)
print(f"Added Function Call Key: {function_call_key.public_key}")

# Use the new Full Access Key to delete the Function Call Key
client_with_new_key = client.with_signer(KeyPairSigner(account_id, full_access_key))
client_with_new_key.send_transaction(account_id, actions=[delete_key(function_call_key.public_key)])
print(f"Deleted Function Call Key: {function_call_key.public_key}")

# Delete the Full Access Key we added (using the original signer)
client.send_transaction(account_id, actions=[delete_key(full_access_key.public_key)])
print(f"Deleted Full Access Key: {full_access_key.public_key}")

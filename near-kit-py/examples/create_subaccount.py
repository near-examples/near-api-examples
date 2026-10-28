import os
import time

from dotenv import load_dotenv
from near import Near, add_full_access_key, create_account, generate_key, transfer

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Generate a new key pair for the subaccount
key = generate_key()

# Create a unique subaccount name using the timestamp
new_account_id = f"{int(time.time() * 1000)}.{account_id}"

# Create the subaccount, fund it and add a key in one atomic transaction
client.send_transaction(
    new_account_id,
    actions=[create_account(), transfer("0.1 NEAR"), add_full_access_key(key.public_key)],
)

print(f"Created subaccount: {new_account_id}")
print(f"Private key: {key.secret_key}")

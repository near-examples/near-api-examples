import os
import time

from dotenv import load_dotenv
from near import Near, generate_key

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Generate a new key pair for the top-level account
key = generate_key()

# Create a unique top-level account name using the timestamp
new_account_id = f"{int(time.time() * 1000)}.testnet"

# Create the top-level account by calling the testnet contract
client.call(
    "testnet",
    "create_account",
    {"new_account_id": new_account_id, "new_public_key": str(key.public_key)},
    deposit="0.1 NEAR",
    gas="30 Tgas",
)

print(f"Created top-level account: {new_account_id}")
print(f"Private key: {key.secret_key}")

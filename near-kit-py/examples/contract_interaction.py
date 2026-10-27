import os

from dotenv import load_dotenv
from near import Near

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Read-only calls do not need a signer
total = client.view("guestbook.near-examples.testnet", "total_messages")
print(f"Total messages: {total}")

messages = client.view(
    "guestbook.near-examples.testnet", "get_messages", {"from_index": "0", "limit": "10"}
)
print(messages)

# To modify state, call the contract method
client.call("guestbook.near-examples.testnet", "add_message", {"text": "Hello!"}, gas="30 Tgas")

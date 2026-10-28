import os

from dotenv import load_dotenv
from near import Near

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Send NEAR tokens to another account
result = client.send("receiver-account.testnet", "0.1 NEAR")

print(f"Transfer result: {result.transaction_hash}")

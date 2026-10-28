import os

from dotenv import load_dotenv
from near import Near

load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a client signing with a private key string
client = Near(network="testnet", account_id=account_id, private_key=private_key)  # ed25519:5Fg2...

# Test the signer by transferring NEAR
client.send("receiver-account.testnet", "1 NEAR")

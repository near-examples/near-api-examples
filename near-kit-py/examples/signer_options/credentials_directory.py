import os

from dotenv import load_dotenv
from near import Near

load_dotenv()
account_id = os.environ["ACCOUNT_ID"]

# Load the key from the legacy credentials directory: ~/.near-credentials/testnet/<account_id>.json
client = Near.from_file(account_id, network="testnet")

# Test the signer by transferring NEAR
client.send("receiver-account.testnet", "1 NEAR")

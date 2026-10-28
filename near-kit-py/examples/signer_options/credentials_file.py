import json
import os

from dotenv import load_dotenv
from near import KeyPairSigner, Near, parse_key

load_dotenv()
account_id = os.environ["ACCOUNT_ID"]

# Load the key from a credentials file with a `private_key` field, as written by the NEAR CLI
with open("../credentials-file.json") as f:
    credentials = json.load(f)
client = Near(network="testnet", signer=KeyPairSigner(account_id, parse_key(credentials["private_key"])))

# Test the signer by transferring NEAR
client.send("receiver-account.testnet", "1 NEAR")

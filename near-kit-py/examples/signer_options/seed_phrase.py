import os

from dotenv import load_dotenv
from near import KeyPairSigner, Near, key_from_seed_phrase

load_dotenv()
seed_phrase = os.environ["SEED_PHRASE"]
account_id = os.environ["ACCOUNT_ID"]

# Derive the key from a seed phrase (path m/44'/397'/0')
key = key_from_seed_phrase(seed_phrase)  # "royal success river ..."
client = Near(network="testnet", signer=KeyPairSigner(account_id, key))

# Test the signer by transferring NEAR
client.send("receiver-account.testnet", "1 NEAR")

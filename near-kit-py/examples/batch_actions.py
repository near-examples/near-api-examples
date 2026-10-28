import os

from dotenv import load_dotenv
from near import Near, function_call, transfer

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Batch multiple actions in one atomic transaction to the same receiver
result = client.send_transaction(
    "counter.near-examples.testnet",
    actions=[function_call("increment", gas="30 Tgas"), transfer("0.001 NEAR")],
)

print(f"Batch actions result: {result.transaction_hash}")

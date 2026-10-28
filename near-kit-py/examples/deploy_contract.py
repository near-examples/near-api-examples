import os

from dotenv import load_dotenv
from near import Near, deploy_contract

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Deploy a contract to the signer account
with open("../contracts/contract.wasm", "rb") as f:
    wasm_code = f.read()

result = client.send_transaction(account_id, actions=[deploy_contract(wasm_code)])

print(f"Deploy contract result: {result.transaction_hash}")

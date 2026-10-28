import os
import time

from dotenv import load_dotenv
from near import (
    KeyPairSigner,
    Near,
    add_full_access_key,
    create_account,
    delete_account,
    generate_key,
    transfer,
)

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]

# Create a connection to testnet with signing capabilities
client = Near(network="testnet", account_id=account_id, private_key=private_key)

# Create a subaccount that we will delete afterwards
key = generate_key()
account_to_delete = f"{int(time.time() * 1000)}.{account_id}"

client.send_transaction(
    account_to_delete,
    actions=[create_account(), transfer("0.01 NEAR"), add_full_access_key(key.public_key)],
    wait_until="FINAL",
)
print(f"Created account: {account_to_delete}")

# Sign as the new account, reusing the same connection
new_account = client.with_signer(KeyPairSigner(account_to_delete, key))

# Delete the account, sending the remaining balance to the beneficiary
new_account.send_transaction(account_to_delete, actions=[delete_account(account_id)])

print(f"Deleted account: {account_to_delete}")
print(f"Beneficiary: {account_id}")

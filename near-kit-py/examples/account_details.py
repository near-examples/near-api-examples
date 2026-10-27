import near

# Reads are stateless: no client or credentials needed
account_id = "example-account.testnet"

# Get the account balance (Amount: an exact int in yoctoNEAR that prints as NEAR)
balance = near.balance(account_id)
print(f"Account: {account_id}")
print(f"Balance: {balance}")

# Get the account state: code hash and storage usage
account = near.account(account_id)
print(f"Code hash: {account.code_hash}")
print(f"Storage usage: {account.storage_usage} bytes")

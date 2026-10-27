from near import Near

# Connect to a custom RPC endpoint (no signing needed for view operations)
client = Near(network="testnet", rpc_url="https://test.rpc.fastnear.com")

# Test the connection by fetching the balance of an account
balance = client.balance("my-new-account.testnet")
print(f"Balance: {balance}")

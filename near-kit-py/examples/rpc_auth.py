import os

from dotenv import load_dotenv
from near import Near

# Load .env from the repo root
load_dotenv()

# Replace with your own API key, or set FASTNEAR_API_KEY in .env
api_key = os.environ.get("FASTNEAR_API_KEY", "1" * 64)

# Authenticate via query parameter appended to the RPC URL
client = Near(network="mainnet", rpc_url=f"https://rpc.mainnet.fastnear.com?apiKey={api_key}")

print("Using authenticated FastNear RPC")

# Query an account balance to verify the connection
balance = client.balance("root.near")
print(f"Balance: {balance}")

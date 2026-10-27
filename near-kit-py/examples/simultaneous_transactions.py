import asyncio
import os

from dotenv import load_dotenv
from near import AsyncNear

# Load environment variables
load_dotenv()
private_key = os.environ["PRIVATE_KEY"]
account_id = os.environ["ACCOUNT_ID"]


async def main():
    # Create an async connection to testnet with signing capabilities
    async with AsyncNear(network="testnet", account_id=account_id, private_key=private_key) as client:
        # Prepare the transactions
        tx1 = client.call("guestbook.near-examples.testnet", "add_message", {"text": "Hello, world!"})
        tx2 = client.call("counter.near-examples.testnet", "increment")

        # Send them at the same time: the client reserves a distinct nonce for each
        results = await asyncio.gather(tx1, tx2)

        for result in results:
            print(f"Transaction: {result.transaction_hash}")


asyncio.run(main())

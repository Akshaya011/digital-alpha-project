import json
from datetime import datetime, timezone

from psycopg2.extras import execute_values
from db import get_db_connection


def parse_timestamp(value):
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(
            value / 1000,
            tz=timezone.utc
        )

    value = str(value).strip()

    if "T" in value:
        if value.endswith("Z"):
            value = value[:-1] + "+00:00"

        return datetime.fromisoformat(value)

    if "/" in value:
        return datetime.strptime(
            value,
            "%d/%m/%Y %H:%M:%S"
        ).replace(tzinfo=timezone.utc)

    return datetime.strptime(
        value,
        "%Y-%m-%d"
    ).replace(tzinfo=timezone.utc)


# Load JSON
with open("transactions.json", "r") as file:
    transactions = json.load(file)

print(f"Found {len(transactions)} transactions")


# Prepare data
rows = []

for txn in transactions:
    try:
        rows.append((
            txn.get("id"),
            parse_timestamp(txn.get("timestamp")),
            txn.get("merchant"),
            txn.get("category"),
            txn.get("amount"),
            txn.get("currency"),
            txn.get("status"),
            txn.get("payment_method")
        ))
    except Exception as e:
        print(f"Error processing {txn.get('id')}: {e}")


# Connect
conn = get_db_connection()
cur = conn.cursor()


# Batch insert
query = """
    INSERT INTO transactions
    (
        id,
        timestamp,
        merchant,
        category,
        amount,
        currency,
        status,
        payment_method
    )
    VALUES %s
    ON CONFLICT (id) DO NOTHING
"""

execute_values(
    cur,
    query,
    rows,
    page_size=1000
)

conn.commit()

cur.close()
conn.close()

print(f"Successfully processed {len(rows)} transactions!")
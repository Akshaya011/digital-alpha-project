import os
from datetime import datetime, timezone
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection
from controllers.transaction_controller import transaction_bp

app = Flask(__name__)

# CORS
# frontend_url = os.getenv(
#     "FRONTEND_URL",
#     "http://localhost:5173","https://frontend-35am4c5q7-akshays-projects-7ccd7aed.vercel.app/"
# )

CORS(app)

# Register routes
app.register_blueprint(transaction_bp)


@app.route("/")
def home():
    return {"message": "Backend is running"}


@app.route("/test-db")
def test_db():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT COUNT(*) FROM transactions")
        result = cur.fetchone()

        return {"transaction_count": result[0]}

    finally:
        cur.close()
        conn.close()


@app.post("/bill/pay")
def pay_bill():
    return {
        "payment_id": str(uuid4()),
        "amount": 24580,
        "status": "PAID",
        "paid_at": datetime.now(timezone.utc).isoformat()
    }, 200


REWARDS = {
    "Amazon ₹500 voucher": 500,
    "Swiggy ₹250 voucher": 300,
    "Movie ticket": 800,
}


@app.get("/rewards")
def get_rewards():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT balance FROM rewards_account WHERE id = 1")
        balance = cur.fetchone()[0]
        return jsonify({
            "balance": balance,
            "rewards": [
                {"name": name, "coins": coins}
                for name, coins in REWARDS.items()
            ],
        }), 200
    finally:
        cur.close()
        conn.close()


@app.post("/rewards/redeem")
def redeem_reward():
    data = request.get_json(silent=True) or {}
    reward_name = data.get("reward_name")

    if reward_name not in REWARDS:
        return jsonify({"error": "Invalid reward"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "SELECT balance FROM rewards_account WHERE id = 1 FOR UPDATE"
        )
        balance = cur.fetchone()[0]
        cost = REWARDS[reward_name]

        if balance < cost:
            return jsonify({"error": "Not enough reward coins"}), 400

        cur.execute(
            "UPDATE rewards_account SET balance = balance - %s WHERE id = 1",
            (cost,)
        )
        cur.execute(
            """
            INSERT INTO reward_redemptions (reward_name, coins)
            VALUES (%s, %s)
            RETURNING id, redeemed_at
            """,
            (reward_name, cost)
        )
        redemption_id, redeemed_at = cur.fetchone()
        conn.commit()

        return jsonify({
            "redemption_id": redemption_id,
            "reward_name": reward_name,
            "coins": cost,
            "balance": balance - cost,
            "redeemed_at": redeemed_at.isoformat(),
        }), 200
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
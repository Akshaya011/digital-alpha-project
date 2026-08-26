import os
from datetime import datetime, timezone
from uuid import uuid4

from flask import Flask
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
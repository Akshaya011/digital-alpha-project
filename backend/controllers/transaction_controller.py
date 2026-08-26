from flask import Blueprint, request, jsonify
from db import get_db_connection

transaction_bp = Blueprint("transactions", __name__)


# GET all transactions
@transaction_bp.route("/transactions", methods=["GET"])
def get_transactions():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                id,
                timestamp,
                merchant,
                category,
                amount,
                currency,
                status,
                payment_method
            FROM transactions
            ORDER BY timestamp DESC
        """)

        rows = cur.fetchall()

        transactions = []

        for row in rows:
            transactions.append({
                "id": row[0],
                "timestamp": row[1].isoformat(),
                "merchant": row[2],
                "category": row[3],
                "amount": float(row[4]),
                "currency": row[5],
                "status": row[6],
                "payment_method": row[7]
            })

        return jsonify(transactions), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# GET transaction by ID
@transaction_bp.route("/transactions/<string:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                id,
                timestamp,
                merchant,
                category,
                amount,
                currency,
                status,
                payment_method
            FROM transactions
            WHERE id = %s
        """, (transaction_id,))

        row = cur.fetchone()

        if not row:
            return jsonify({
                "error": "Transaction not found"
            }), 404

        transaction = {
            "id": row[0],
            "timestamp": row[1].isoformat(),
            "merchant": row[2],
            "category": row[3],
            "amount": float(row[4]),
            "currency": row[5],
            "status": row[6],
            "payment_method": row[7]
        }

        return jsonify(transaction), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# POST new transaction
@transaction_bp.route("/transactions", methods=["POST"])
def create_transaction():
    data = request.get_json()

    required_fields = [
        "id",
        "timestamp",
        "merchant",
        "category",
        "amount",
        "currency",
        "status",
        "payment_method"
    ]

    missing_fields = [
        field for field in required_fields
        if field not in data
    ]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing_fields
        }), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
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
            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING
                id,
                timestamp,
                merchant,
                category,
                amount,
                currency,
                status,
                payment_method
        """, (
            data["id"],
            data["timestamp"],
            data["merchant"],
            data["category"],
            data["amount"],
            data["currency"],
            data["status"],
            data["payment_method"]
        ))

        row = cur.fetchone()
        conn.commit()

        transaction = {
            "id": row[0],
            "timestamp": row[1].isoformat(),
            "merchant": row[2],
            "category": row[3],
            "amount": float(row[4]),
            "currency": row[5],
            "status": row[6],
            "payment_method": row[7]
        }

        return jsonify(transaction), 201

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# DELETE transaction
@transaction_bp.route("/transactions/<string:transaction_id>", methods=["DELETE"])
def delete_transaction(transaction_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            DELETE FROM transactions
            WHERE id = %s
            RETURNING id
        """, (transaction_id,))

        deleted = cur.fetchone()

        if not deleted:
            return jsonify({
                "error": "Transaction not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Transaction deleted successfully",
            "id": deleted[0]
        }), 200

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()
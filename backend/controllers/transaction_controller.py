from flask import Blueprint, request, jsonify
from db import get_db_connection

transaction_bp = Blueprint("transactions", __name__)


# GET all transactions
# GET transactions with search, filters and pagination
@transaction_bp.route("/transactions", methods=["GET"])
def get_transactions():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        page = int(request.args.get("page", 1))
        limit = 20
        offset = (page - 1) * limit

        search = request.args.get("search", "")
        category = request.args.get("category", "")
        status = request.args.get("status", "")
        payment = request.args.get("payment_method", "")

        conditions = []
        params = []

        if search:
            conditions.append("(merchant ILIKE %s OR id ILIKE %s)")
            params += [f"%{search}%", f"%{search}%"]

        if category:
            conditions.append("category = %s")
            params.append(category)

        if status:
            conditions.append("status = %s")
            params.append(status)

        if payment:
            conditions.append("payment_method = %s")
            params.append(payment)

        where = ""
        if conditions:
            where = "WHERE " + " AND ".join(conditions)

        # Total number of matching transactions
        cur.execute(
            f"SELECT COUNT(*) FROM transactions {where}",
            params
        )
        total = cur.fetchone()[0]

        # Get only 20 transactions
        cur.execute(
            f"""
            SELECT id, timestamp, merchant, category,
                   amount, currency, status, payment_method
            FROM transactions
            {where}
            ORDER BY timestamp DESC
            LIMIT %s OFFSET %s
            """,
            params + [limit, offset]
        )

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

        return jsonify({
            "transactions": transactions,
            "total": total,
            "page": page,
            "total_pages": (total + limit - 1) // limit
        }), 200

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
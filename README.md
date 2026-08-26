# Digital Alpha Project

A full-stack transaction management dashboard built with React, TypeScript, Tailwind CSS, Flask, and PostgreSQL.
The application provides:

- A dashboard with spending totals and recent transactions
- Paginated transaction browsing
- Search by merchant name or transaction ID
- Transaction creation and deletion APIs
- A bill payment demo flow with loading, success, and error states

## Project Structure

```text
digital alpha project/
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── requirements.txt
│   ├── seed.py
│   ├── transactions.json
│   └── controllers/transaction_controller.py
└── frontend/
		├── package.json
		├── vite.config.ts
		└── src/
				├── App.tsx
				├── components/Sidebar.tsx
				├── pages/
				└── services/api.ts
```

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Axios
- **Backend:** Python, Flask, Flask-CORS, Gunicorn
- **Database:** PostgreSQL
- **Deployment:** The frontend can be deployed to Vercel or another static host. The backend can be deployed to Render or another WSGI-compatible host.

## Prerequisites

Install the following before starting:

- Git
- Node.js 18 or newer
- npm
- Python 3.10 or newer
- PostgreSQL, or a hosted PostgreSQL database such as Neon

Check the installed versions:

```bash
git --version
node --version
npm --version
python3 --version
```

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd "digital alpha project"
```

Replace `<your-github-repository-url>` with the URL of this GitHub repository.

## 2. Configure PostgreSQL

The backend reads the database connection string from `backend/.env`.

Create the file:

```bash
cd backend
touch .env
```

Add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Do not commit this file. It contains database credentials. Add the following entries to `.gitignore` if they are not already present:

```gitignore
backend/.env
frontend/.env
backend/venv/
backend/__pycache__/
frontend/node_modules/
frontend/dist/
```

Create the table required by `seed.py`:

```sql
CREATE TABLE IF NOT EXISTS transactions (
		id VARCHAR(50) PRIMARY KEY,
		timestamp TIMESTAMPTZ NOT NULL,
		merchant VARCHAR(255) NOT NULL,
		category VARCHAR(100) NOT NULL,
		amount NUMERIC(12, 2) NOT NULL,
		currency VARCHAR(10) NOT NULL,
		status VARCHAR(30) NOT NULL,
		payment_method VARCHAR(100) NOT NULL
);
```

## 3. Set Up and Seed the Backend

From the `backend` directory, create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Run the seed script from `backend`, where `transactions.json` is located:

```bash
python seed.py
```

The script inserts transaction data and skips duplicate IDs.

Start Flask:

```bash
python app.py
```

The backend runs at `http://localhost:5000`.

For production-style local serving, use Gunicorn:

```bash
gunicorn app:app
```

Test that the backend is running:

```bash
curl http://localhost:5000/
curl http://localhost:5000/test-db
```

## 4. Set Up the Frontend

Open a second terminal at the project root:

```bash
cd "digital alpha project/frontend"
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Frontend Commands

Run these commands from `frontend`:

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

## API Documentation

All endpoints are served by the backend.

### Health check

```http
GET /
```

### Database health check

```http
GET /test-db
```

Example response:

```json
{"transaction_count": 100}
```

### List transactions

```http
GET /transactions?page=1&search=amazon
```

Query parameters:

| Parameter | Default | Description |
| --- | --- | --- |
| `page` | `1` | Page number, with 20 records per page |
| `search` | empty | Searches merchant name or transaction ID |
| `category` | empty | Exact category filter |
| `status` | empty | Exact status filter |
| `payment_method` | empty | Exact payment method filter |

Example response:

```json
{
	"transactions": [],
	"total": 0,
	"page": 1,
	"total_pages": 0
}
```

### Create a transaction

```http
POST /transactions
Content-Type: application/json
```

```json
{
	"id": "TXN2026000001",
	"timestamp": "2026-08-26T12:00:00Z",
	"merchant": "Example Store",
	"category": "Shopping",
	"amount": 1250.50,
	"currency": "INR",
	"status": "SUCCESS",
	"payment_method": "Credit Card"
}
```

### Delete a transaction

```http
DELETE /transactions/<transaction_id>
```

### Pay the bill

```http
POST /bill/pay
```

This returns a generated payment ID and marks the current demo bill of INR 24,580 as paid for the current frontend session. It is not connected to a real payment provider and is not persisted in the database.

## Deployment

### Deploy the backend

For Render or another Python host:

1. Create a web service connected to this repository.
2. Set the service root directory to `backend`.
3. Set the build command to `pip install -r requirements.txt`.
4. Set the start command to `gunicorn app:app`.
5. Add `DATABASE_URL` as a secret environment variable.
6. Deploy and copy the generated backend URL.
7. Verify it with `/` and `/test-db`.

### Deploy the frontend

For Vercel or another Vite-compatible host:

1. Create a project connected to this repository.
2. Set the project root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add `VITE_API_URL` with the deployed backend URL, for example `https://your-backend.example.com`.
6. Deploy the frontend.

The frontend reads Vite environment variables at build time. Redeploy after changing `VITE_API_URL`.

## Troubleshooting

### `npm` cannot find `package.json`

Run frontend commands from `frontend`, not the repository root:

```bash
cd frontend
npm run build
```

### Frontend shows a network error

Check that:

1. Flask is running.
2. `frontend/.env` contains the correct `VITE_API_URL`.
3. The frontend was restarted after changing `.env`.
4. The deployed backend allows requests from the frontend through CORS.

### Backend cannot connect to PostgreSQL

Check `backend/.env`, confirm `DATABASE_URL` is valid, and ensure the database is reachable. For hosted PostgreSQL, the connection string may require `sslmode=require`.

### Transactions are empty

Confirm that the table exists, run `python seed.py`, and then check `/test-db`.

### Search returns no results

Search matches merchant names and transaction IDs. It is case-insensitive, but category, status, and payment method filters are exact matches.

## Security Notes

- Never commit database passwords, API keys, or private URLs.
- Keep `.env` files out of Git.
- Replace the demo bill endpoint with a verified payment provider before using this application for real payments.
- Add authentication and authorization before exposing transaction creation or deletion publicly.

## License

No license has been specified for this repository.


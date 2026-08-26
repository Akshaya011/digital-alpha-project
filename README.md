# Digital Alpha Project

A full-stack transaction management dashboard built with React, TypeScript, Tailwind CSS, Flask, and PostgreSQL.
The application provides:

- A dashboard with spending totals and recent transactions
- Paginated transaction browsing
- Search by merchant name or transaction ID
- Category, status, payment-method filters, and sorting
- Category spending chart
- Backend-validated reward redemption
- Transaction creation and deletion APIs
- A bill payment demo flow with loading, success, and error states

Repository: https://github.com/Akshaya011/digital-alpha-project

Live backend: https://digital-alpha-project.onrender.com/

Live frontend: not confirmed in this repository. Run the frontend locally or use the URL provided by its hosting project.

More project context is recorded in [ASSUMPTIONS.md](ASSUMPTIONS.md), [DECISIONS.md](DECISIONS.md), and [AI-USAGE.md](AI-USAGE.md).

## Quick Start: Under Five Minutes

You need Python 3.10+, Node.js 18+, npm, and a PostgreSQL database.

1. Clone the repository and enter it:

	```bash
	git clone https://github.com/Akshaya011/digital-alpha-project.git
	cd digital-alpha-project
	```

2. Create `backend/.env` with your PostgreSQL URL:

	```env
	DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
	```

3. Create the table, install Python dependencies, and seed the database:

	```bash
	cd backend
	set -a; source .env; set +a
	psql "$DATABASE_URL" -f schema.sql
	python3 -m venv venv
	source venv/bin/activate
	pip install -r requirements.txt
	python seed.py
	python app.py
	```

4. In a second terminal, configure and start the frontend:

	```bash
	cd "digital alpha project/frontend"
	printf 'VITE_API_URL=http://localhost:5000\n' > .env
	npm install
	npm run dev
	```

Open the Vite URL, normally http://localhost:5173. The `psql` command requires the PostgreSQL client; hosted PostgreSQL providers commonly provide a copy-paste connection command.

## Project Structure

```text
digital alpha project/
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── requirements.txt
│   ├── schema.sql
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

Create the table and indexes required by `seed.py` by running the committed schema:

```bash
set -a; source .env; set +a
psql "$DATABASE_URL" -f schema.sql
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
| `sort` | `timestamp` | `timestamp`, `amount`, `merchant`, `category`, or `status` |
| `direction` | `desc` | `asc` or `desc` |

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

The frontend opens a payment dialog and sends the requested amount. The backend rejects invalid, zero, and over-the-balance amounts, then persists the reduced balance in `bill_account`. It returns `PAID` when the bill reaches zero or `PARTIALLY_PAID` otherwise. This is still a demo: it is not connected to a real payment provider.

### Get rewards

```http
GET /rewards
```

Returns the current coin balance and available rewards.

### Redeem a reward

```http
POST /rewards/redeem
Content-Type: application/json
```

```json
{"reward_name": "Amazon ₹500 voucher"}
```

The backend rejects invalid reward names and redemptions that exceed the current balance. Successful redemptions are recorded in `reward_redemptions` and deducted from `rewards_account`.

### Category spending

```http
GET /analytics/categories
```

Returns successful transaction totals grouped by category for the dashboard chart.

## Delivery Status

### Done

- React dashboard with responsive navigation
- Spending total, transaction count, and recent transactions
- PostgreSQL-backed transaction listing
- Server-side search by merchant or transaction ID
- Server-side filters and sorting for large datasets
- Server-side pagination with a 10-number navigation window
- Category spending chart
- Reward balance and validated redemption flow
- Transaction create and delete API endpoints
- Loading, empty, and payment-error UI states
- Local setup instructions, schema, seed script, and API documentation

### Not Done

- User accounts, login, or authorization
- Real payment-provider integration
- Persistent bills or payment history
- Transaction editing in the UI
- Frontend production deployment URL in this repository
- Automated backend or frontend test suite
- Virtualized rendering is not included because only 20 rows are rendered per page

### Known Issues

- `POST /bill/pay` records a demo balance reduction, but it does not move real money or use a payment provider.
- CORS is currently open with `CORS(app)` and should be restricted to the deployed frontend origin.
- The bill amount and due date are hard-coded in the Dashboard.
- The backend does not validate page bounds or all transaction field values before querying/inserting.
- The chart shows successful spending only.
- The frontend has no authentication, so all exposed transaction operations are public.
- The backend must be started separately from the frontend during local development.

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


# Technical Decisions

- **React local state:** `useState` and `useEffect` manage page data, search state, loading, and bill payment because the app has a small number of screens and no shared server-state requirements.
- **Axios service layer:** API calls live in `frontend/src/services/api.ts` so pages do not duplicate HTTP configuration or response typing.
- **Server-side pagination:** The backend returns 20 transactions per page and total-page metadata. This keeps large result sets efficient and makes search totals correct.
- **Numbered pagination window:** The UI displays a moving window of 10 page numbers instead of rendering every page number, keeping navigation usable for large datasets.
- **Server-side search:** Merchant and transaction-ID search is sent to PostgreSQL through the API, rather than filtering only the currently loaded page.
- **PostgreSQL schema:** A normalized `transactions` table stores one transaction per row with a primary key on `id`, a timezone-aware timestamp, and numeric money values.
- **Indexes:** Timestamp and merchant indexes support the default sort order and the primary search field without adding unnecessary indexes for the small initial schema.
- **Seed strategy:** `seed.py` loads `transactions.json`, normalizes timestamps, batch-inserts rows, and ignores duplicate IDs so it can be rerun safely.
- **Flask blueprint:** Transaction routes remain in `controllers/transaction_controller.py`, while app setup and health/payment demo routes remain in `app.py`.
- **CORS:** Flask-CORS is enabled for the current deployment simplicity. Production should restrict origins to the deployed frontend.
- **Bill payment:** `POST /bill/pay` returns a generated confirmation because no payment gateway, authentication, or bill persistence requirements were provided.
- **No virtualization:** Virtualized rows were not needed because the API limits each response to 20 records.

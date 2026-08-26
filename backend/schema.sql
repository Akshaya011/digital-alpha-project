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

CREATE INDEX IF NOT EXISTS idx_transactions_timestamp
    ON transactions (timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_merchant
    ON transactions (merchant);

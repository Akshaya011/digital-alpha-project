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

CREATE TABLE IF NOT EXISTS rewards_account (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    balance INTEGER NOT NULL CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
    id BIGSERIAL PRIMARY KEY,
    reward_name VARCHAR(100) NOT NULL,
    coins INTEGER NOT NULL CHECK (coins > 0),
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO rewards_account (id, balance)
VALUES (1, 2450)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS bill_account (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    balance NUMERIC(12, 2) NOT NULL CHECK (balance >= 0),
    due_date DATE NOT NULL
);

INSERT INTO bill_account (id, balance, due_date)
VALUES (1, 24580.00, '2026-09-05')
ON CONFLICT (id) DO NOTHING;

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  getCategorySpending,
  getBill,
  getRewards,
  getTransactions,
  payBill,
  type CategorySpending,
  type Transaction,
} from "../services/api";

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [billBalance, setBillBalance] = useState<number | null>(null);
  const [billDueDate, setBillDueDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [rewardBalance, setRewardBalance] = useState<number | null>(null);

  useEffect(() => {
    getTransactions()
      .then((response) => setTransactions(response.transactions))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCategorySpending().then(setCategorySpending).catch(() => setCategorySpending([]));
  }, []);

  useEffect(() => {
    getBill()
      .then((bill) => {
        setBillBalance(bill.balance);
        setBillDueDate(bill.due_date);
      })
      .catch(() => setPaymentError("Could not load your bill."));
  }, []);

  useEffect(() => {
    getRewards()
      .then((rewards) => setRewardBalance(rewards.balance))
      .catch(() => setRewardBalance(null));
  }, []);

  const totalSpent = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const handlePayBill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError("Enter a valid amount greater than zero.");
      return;
    }

    setPaying(true);
    setPaymentError("");

    try {
      const response = await payBill(amount);
      setBillBalance(response.remaining_balance);
      setPaymentAmount("");
      setShowPayment(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error
        : "Payment failed. Please try again.";
      setPaymentError(message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const billPaid = billBalance === 0;

  if (loading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500">
          Your spending and rewards overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          title="Total Spending"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
        />

        <Card
          title="Transactions"
          value={transactions.length.toLocaleString()}
        />

        <Card
          title="Reward Coins"
          value={`${rewardBalance === null ? "..." : rewardBalance.toLocaleString()} 🪙`}
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Spending by category</h2>
        <div className="mt-5 space-y-4">
          {categorySpending.map((item) => {
            const maximum = categorySpending[0]?.amount || 1;
            return (
              <div key={item.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{item.category}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${(item.amount / maximum) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
          {categorySpending.length === 0 && (
            <p className="text-sm text-slate-500">No spending data available.</p>
          )}
        </div>
      </div>

      {/* Credit Card Bill */}
      <div className="rounded-xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-400">
          Credit Card Bill
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {billBalance === null ? "..." : `₹${billBalance.toLocaleString("en-IN")}`}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {billPaid ? "Paid" : `Due ${billDueDate || "September 5"}`}
        </p>

        <button
          type="button"
          onClick={() => setShowPayment(true)}
          disabled={paying || billBalance === null || billPaid}
          className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {billPaid ? "Paid" : "Pay Bill"}
        </button>

        {paymentError && (
          <p className="mt-3 text-sm text-red-300">{paymentError}</p>
        )}
      </div>

      {showPayment && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowPayment(false);
          }}
        >
          <form
            onSubmit={handlePayBill}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="payment-title" className="text-xl font-semibold text-slate-900">
                  Pay your bill
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Remaining: ₹{billBalance?.toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                aria-label="Close payment dialog"
                className="text-2xl leading-none text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                ×
              </button>
            </div>
            <label htmlFor="payment-amount" className="mt-6 block text-sm font-medium text-slate-700">
              Amount to pay
            </label>
            <input
              id="payment-amount"
              type="number"
              min="0.01"
              max={billBalance ?? undefined}
              step="0.01"
              value={paymentAmount}
              onChange={(event) => setPaymentAmount(event.target.value)}
              placeholder="Enter amount"
              autoFocus
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus-visible:outline-2 focus-visible:outline-slate-900"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={paying}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                {paying ? "Processing..." : "Confirm payment"}
              </button>
            </div>
            {paymentError && <p className="mt-3 text-sm text-red-600">{paymentError}</p>}
          </form>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Recent Transactions</h2>
        </div>

        <div className="divide-y">
          {transactions.slice(0, 5).map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-5"
            >
              <div>
                <p className="font-medium">{t.merchant}</p>
                <p className="text-sm text-slate-500">
                  {t.category}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">
                  ₹{t.amount.toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-green-600">
                  {t.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;
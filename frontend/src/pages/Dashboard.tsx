import { useEffect, useState } from "react";
import {
  getCategorySpending,
  getTransactions,
  payBill,
  type CategorySpending,
  type Transaction,
} from "../services/api";

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [billStatus, setBillStatus] = useState<"DUE" | "PAID">("DUE");
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);

  useEffect(() => {
    getTransactions()
      .then((response) => setTransactions(response.transactions))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCategorySpending().then(setCategorySpending).catch(() => setCategorySpending([]));
  }, []);

  const totalSpent = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const handlePayBill = async () => {
    setPaying(true);
    setPaymentError("");

    try {
      await payBill();
      setBillStatus("PAID");
    } catch {
      setPaymentError("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

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
          value="2,450 🪙"
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
          ₹24,580
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {billStatus === "PAID" ? "Paid" : "Due September 5"}
        </p>

        <button
          type="button"
          onClick={handlePayBill}
          disabled={paying || billStatus === "PAID"}
          className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {paying ? "Processing..." : billStatus === "PAID" ? "Paid" : "Pay Bill"}
        </button>

        {paymentError && (
          <p className="mt-3 text-sm text-red-300">{paymentError}</p>
        )}
      </div>

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
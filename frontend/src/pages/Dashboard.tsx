import { useEffect, useState } from "react";
import { getTransactions, type Transaction } from "../services/api";

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => setError("Failed to load transactions"))
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const successful = transactions.filter(
    (t) => t.status === "SUCCESS"
  ).length;

  const failed = transactions.filter(
    (t) => t.status === "FAILED"
  ).length;

  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your transactions
        </p>
      </header>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading transactions...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && transactions.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            No transactions found.
          </p>
        </div>
      )}

      {/* Dashboard */}
      {!loading && !error && transactions.length > 0 && (
        <>
          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Total Transactions"
              value={transactions.length.toLocaleString()}
            />

            <StatCard
              title="Total Amount"
              value={`₹${totalAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`}
            />

            <StatCard
              title="Successful"
              value={successful.toLocaleString()}
            />

            <StatCard
              title="Failed"
              value={failed.toLocaleString()}
            />

          </section>

          {/* Recent Transactions */}
          <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="font-semibold text-slate-900">
                Recent Transactions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-175 text-left">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      ID
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Merchant
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {transaction.id}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {transaction.merchant}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {transaction.category}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        ₹{transaction.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={transaction.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}


function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : status === "FAILED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

export default Dashboard;
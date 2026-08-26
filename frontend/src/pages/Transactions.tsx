import { useEffect, useState } from "react";
import { getTransactions,type Transaction } from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Transactions
        </h1>
        <p className="text-slate-500">
          View your recent spending
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-slate-500">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="p-6 text-slate-500">
            No transactions found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="p-4">Merchant</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
                      {t.merchant}
                    </td>

                    <td className="p-4 text-slate-500">
                      {t.category}
                    </td>

                    <td className="p-4 font-medium">
                      ₹{t.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-slate-500">
                      {t.payment_method}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          t.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : t.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
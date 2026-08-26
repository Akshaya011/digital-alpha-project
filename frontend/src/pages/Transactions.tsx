import { useEffect, useState, type FormEvent } from "react";
import {
  getTransactions,
  type Transaction,
  type TransactionQuery,
} from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<TransactionQuery>({
    sort: "timestamp",
    direction: "desc",
  });

  const changePage = (page: number) => {
    setTransactions(null);
    setCurrentPage(page);
  };

  useEffect(() => {
    getTransactions(currentPage, query, filters)
      .then((response) => {
        setTransactions(response.transactions);
        setTotalPages(response.total_pages);
      })
      .catch(() => setTransactions([]));
  }, [currentPage, query, filters]);

  const loading = transactions === null;
  const firstPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const lastPage = Math.min(firstPage + 9, totalPages);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTransactions(null);
    setCurrentPage(1);
    setQuery(search.trim());
  };

  const updateFilter = (name: keyof TransactionQuery, value: string) => {
    setTransactions(null);
    setCurrentPage(1);
    setFilters((current) => ({ ...current, [name]: value || undefined }));
  };

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

      <form onSubmit={submitSearch} className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search merchant or transaction ID"
          aria-label="Search transactions"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <select
          value={filters.category ?? ""}
          onChange={(event) => updateFilter("category", event.target.value)}
          aria-label="Filter by category"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {['Food', 'Health', 'Insurance', 'Shopping', 'Travel', 'Utilities'].map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filters.status ?? ""}
          onChange={(event) => updateFilter("status", event.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
        <select
          value={filters.payment_method ?? ""}
          onChange={(event) => updateFilter("payment_method", event.target.value)}
          aria-label="Filter by payment method"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All payment methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="UPI">UPI</option>
          <option value="Netbanking">Netbanking</option>
          <option value="Debit Card">Debit Card</option>
        </select>
        <select
          value={`${filters.sort}-${filters.direction}`}
          onChange={(event) => {
            const [sort, direction] = event.target.value.split("-");
            setTransactions(null);
            setCurrentPage(1);
            setFilters({ sort, direction: direction as "asc" | "desc" });
          }}
          aria-label="Sort transactions"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="timestamp-desc">Newest first</option>
          <option value="timestamp-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
          <option value="merchant-asc">Merchant A-Z</option>
        </select>
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
            <table className="w-full min-w-175">
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

        {!loading && totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-2 border-t p-4"
            aria-label="Transaction pages"
          >
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: lastPage - firstPage + 1 },
              (_, index) => firstPage + index
            ).map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => changePage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
            ))}

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Transactions;
function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 bg-slate-900 p-6 text-white md:block">
      <h1 className="mb-10 text-xl font-bold">
        Finance Dashboard
      </h1>

      <nav className="space-y-2">
        <a
          href="/"
          className="block rounded-lg bg-slate-700 px-4 py-3"
        >
          Dashboard
        </a>

        <a
          href="/transactions"
          className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Transactions
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
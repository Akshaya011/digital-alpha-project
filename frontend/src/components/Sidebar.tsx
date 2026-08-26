import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 bg-slate-900 p-6 text-white md:block">
      <h1 className="mb-10 text-xl font-bold">
        Finance
      </h1>

      <nav className="space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          Transactions
        </NavLink>

        <NavLink
          to="/rewards"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          Rewards
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
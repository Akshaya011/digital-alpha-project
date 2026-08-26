import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/transactions", label: "Transactions", end: false },
    { to: "/rewards", label: "Rewards", end: false },
  ];

  return (
    <>
      <aside className="hidden w-60 shrink-0 bg-slate-900 p-6 text-white md:block">
      <h1 className="mb-10 text-xl font-bold">
        Finance
      </h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-slate-700 bg-slate-900 p-2 text-white md:hidden" aria-label="Mobile navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-slate-700 text-white" : "text-slate-400"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default Sidebar;
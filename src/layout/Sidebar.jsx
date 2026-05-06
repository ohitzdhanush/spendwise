import { NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaHome, FaList, FaSignOutAlt, FaWallet } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-950 text-white shadow-xl shadow-slate-900/15"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="soft-shine flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <FaWallet />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
            SpendWise
          </h2>
          <p className="text-xs font-medium text-slate-500">Money in control</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/analytics" className={linkClass}>
          <FaChartPie /> Analytics
        </NavLink>
        <NavLink to="/transactions" className={linkClass}>
          <FaList /> Transactions
        </NavLink>
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-3 truncate text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {user?.email || "Signed in"}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}

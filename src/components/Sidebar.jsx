import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaHome,
  FaList,
  FaSignOutAlt,
  FaWallet,
} from "react-icons/fa";
import { motion } from "framer-motion";
import LiveClock from "./LiveClock";
import { useAuth } from "../context/useAuth";

const navItems = [
  { to: "/", label: "Dashboard", icon: FaHome },
  { to: "/transactions", label: "Transactions", icon: FaList },
  { to: "/analytics", label: "Analytics", icon: FaChartPie },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-cyan-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800"
    }`;

  return (
    <>
      <motion.aside
        className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white/95 p-5 backdrop-blur lg:flex lg:flex-col"
        initial={{ x: -28, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-600 text-white"
            whileHover={{ rotate: -8, scale: 1.06 }}
          >
            <FaWallet />
          </motion.div>
          <div>
            <p className="text-lg font-black text-slate-950">SpendWise</p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Money clarity
            </p>
          </div>
        </div>

        <div className="mt-5">
          <LiveClock />
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <motion.div
          className="mt-auto rounded-lg border border-slate-200 bg-white p-4"
          whileHover={{ y: -3 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Signed in
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {user?.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </motion.div>
      </motion.aside>

      <motion.div
        className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-600 text-white">
              <FaWallet />
            </div>
            <span className="font-black text-slate-950">SpendWise</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
        <div className="mt-3">
          <LiveClock compact />
        </div>
        <nav className="mt-3 grid grid-cols-3 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
}

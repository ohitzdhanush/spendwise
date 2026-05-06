import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChartPie, FaHome, FaList } from "react-icons/fa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="animated-grid flex min-h-screen bg-[#eef4f8] text-slate-900 dark:bg-slate-950 dark:text-white">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar dark={dark} setDark={setDark} />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

function MobileNav() {
  const linkClass = ({ isActive }) =>
    `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
      isActive
        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
        : "text-slate-500 hover:bg-slate-100"
    }`;

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-3xl border border-white/70 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-xl lg:hidden">
      <NavLink to="/" className={linkClass}>
        <FaHome className="text-base" />
        Home
      </NavLink>
      <NavLink to="/transactions" className={linkClass}>
        <FaList className="text-base" />
        Records
      </NavLink>
      <NavLink to="/analytics" className={linkClass}>
        <FaChartPie className="text-base" />
        Charts
      </NavLink>
    </nav>
  );
}

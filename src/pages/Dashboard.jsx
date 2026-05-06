import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowTrendUp, FaReceipt, FaWallet } from "react-icons/fa6";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import FilterBar from "../components/FilterBar";
import { useExpense } from "../context/ExpenseContext";

export default function Dashboard() {
  const { filtered, fetchExpenses, applyFilters, filters } = useExpense();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const total = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const average = filtered.length ? Math.round(total / filtered.length) : 0;
  const highest = filtered.reduce((max, e) => Math.max(max, Number(e.amount) || 0), 0);

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/20 sm:p-7"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Live summary
            </p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Track every rupee with clarity.
            </h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-sm text-slate-300">Filtered total</p>
            <p className="text-3xl font-extrabold">Rs {total.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<FaWallet />} label="Total spend" value={`Rs ${total.toLocaleString("en-IN")}`} />
        <StatCard icon={<FaReceipt />} label="Transactions" value={filtered.length} />
        <StatCard icon={<FaArrowTrendUp />} label="Highest entry" value={`Rs ${highest.toLocaleString("en-IN")}`} sub={`Avg Rs ${average.toLocaleString("en-IN")}`} />
      </section>

      <ExpenseForm />
      <FilterBar />
      <ExpenseList />
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p>
      {sub ? <p className="mt-1 text-xs font-medium text-slate-400">{sub}</p> : null}
    </motion.div>
  );
}

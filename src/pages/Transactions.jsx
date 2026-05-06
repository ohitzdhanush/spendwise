import { useEffect } from "react";
import { motion } from "framer-motion";
import ExpenseList from "../components/ExpenseList";
import FilterBar from "../components/FilterBar";
import { useExpense } from "../context/ExpenseContext";

export default function Transactions() {
  const { fetchExpenses, applyFilters, filters } = useExpense();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] bg-white/90 p-5 shadow-xl shadow-slate-900/5 dark:bg-slate-900/85 sm:p-7"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Transactions
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">
          All expense records
        </h1>
      </motion.section>

      <FilterBar />
      <ExpenseList />
    </div>
  );
}

import { useEffect } from "react";
import { motion } from "framer-motion";
import ChartSection from "../components/ChartSection";
import { useExpense } from "../context/ExpenseContext";

export default function Analytics() {
  const { fetchExpenses, expenses, loading } = useExpense();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/80 bg-white/85 p-8 text-center text-slate-500 shadow-xl shadow-slate-900/5">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] bg-white/90 p-5 shadow-xl shadow-slate-900/5 dark:bg-slate-900/85 sm:p-7"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Analytics
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
            Spending patterns
          </h1>
          <p className="text-lg font-bold text-slate-600 dark:text-slate-300">
            Rs {total.toLocaleString("en-IN")} total
          </p>
        </div>
      </motion.section>

      {expenses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500">
          No data found.
        </div>
      ) : (
        <ChartSection />
      )}
    </div>
  );
}

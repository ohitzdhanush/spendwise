import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCalendarDays, FaPen, FaTrash } from "react-icons/fa6";
import { useExpense } from "../context/ExpenseContext";

export default function ExpenseList() {
  const { filtered, deleteExpense, updateExpense, loading } = useExpense();

  const [editId, setEditId] = useState(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const getAccent = (itemCategory) => {
    if (itemCategory === "Food") return "bg-amber-100 text-amber-700";
    if (itemCategory === "Travel") return "bg-sky-100 text-sky-700";
    if (itemCategory === "Bills") return "bg-violet-100 text-violet-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const formatSubmittedAt = (value) => {
    if (!value) return "Date not available";

    const submittedAt = new Date(value);
    if (Number.isNaN(submittedAt.getTime())) return "Date not available";

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(submittedAt);
  };

  const startEdit = (expense) => {
    setEditId(expense.id);
    setAmount(expense.amount);
    setCategory(expense.category);
  };

  const saveEdit = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    updateExpense(editId, {
      amount: numericAmount,
      category,
    });
    setEditId(null);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/85">
        <p className="animate-pulse text-slate-500">Loading expenses...</p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Expenses</h2>
          <p className="text-sm font-medium text-slate-500">{filtered.length} records found</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
          No expenses found.
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((expense) => (
              <motion.div
                key={expense.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
              >
                {editId === expense.id ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
                    <input
                      type="number"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800"
                    />

                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option>Food</option>
                      <option>Travel</option>
                      <option>Bills</option>
                    </select>

                    <button
                      type="button"
                      onClick={saveEdit}
                      className="rounded-2xl bg-emerald-500 px-4 py-2 font-bold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="rounded-2xl bg-slate-100 px-4 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold ${getAccent(expense.category)}`}>
                        {expense.category?.slice(0, 1) || "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-slate-950 dark:text-white">
                          {expense.category}
                        </p>
                        <p className="text-sm font-semibold text-slate-500">
                          Rs {Number(expense.amount || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <FaCalendarDays />
                          {formatSubmittedAt(expense.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:justify-end">
                      <button
                        type="button"
                        aria-label="Edit expense"
                        onClick={() => startEdit(expense)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 sm:flex-none"
                      >
                        <FaPen /> Edit
                      </button>

                      <button
                        type="button"
                        aria-label="Delete expense"
                        onClick={() => deleteExpense(expense.id)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-100 sm:flex-none"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

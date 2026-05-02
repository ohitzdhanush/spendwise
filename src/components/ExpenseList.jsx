import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck, FaPen, FaTrash, FaXmark } from "react-icons/fa6";
import { categories } from "../constants/expenses";
import { useExpense } from "../context/useExpense";
import { riseIn } from "../utils/motion";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function toDateTimeInputValue(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function ExpenseList({ limit }) {
  const { filtered, deleteExpense, updateExpense, loading } = useExpense();
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});
  const visibleExpenses = limit ? filtered.slice(0, limit) : filtered;

  const startEdit = (expense) => {
    setEditId(expense.id);
    setDraft({
      amount: expense.amount,
      category: expense.category,
      dateTime: toDateTimeInputValue(expense.submittedAt || expense.dateTime || expense.date),
      note: expense.note,
    });
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveEdit = () => {
    const submittedAt = new Date(draft.dateTime).toISOString();
    updateExpense(editId, {
      ...draft,
      title: draft.category,
      amount: Number(draft.amount),
      date: submittedAt,
      dateTime: submittedAt,
      submittedAt,
      createdAt: submittedAt,
    });
    setEditId(null);
    setDraft({});
  };

  if (loading && filtered.length === 0) {
    return (
      <div className="surface p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div className="surface overflow-hidden" variants={riseIn}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="font-bold text-slate-950">Expenses</h2>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
          {visibleExpenses.length}
        </span>
      </div>

      {visibleExpenses.length === 0 ? (
        <motion.div
          className="px-4 py-12 text-center"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="font-bold text-slate-900">No expenses found</p>
          <p className="mt-1 text-sm text-slate-500">
            Add a new expense or clear filters to see more activity.
          </p>
        </motion.div>
      ) : (
        <div className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {visibleExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              className="grid gap-3 px-4 py-4 transition-colors hover:bg-cyan-50/40 lg:grid-cols-[1.4fr_1fr_0.8fr_auto] lg:items-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -18 }}
              layout
            >
              {editId === expense.id ? (
                <>
                  <select
                    className="field"
                    value={draft.category}
                    onChange={(e) => updateDraft("category", e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    className="field"
                    value={draft.note}
                    placeholder="Note"
                    onChange={(e) => updateDraft("note", e.target.value)}
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="number"
                      className="field"
                      value={draft.amount}
                      onChange={(e) => updateDraft("amount", e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      className="field"
                      value={draft.dateTime}
                      onChange={(e) => updateDraft("dateTime", e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={saveEdit} className="btn-primary" aria-label="Save">
                      <FaCheck />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="btn-secondary"
                      aria-label="Cancel"
                    >
                      <FaXmark />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-bold text-slate-950">{expense.category}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {expense.note || "No note added"}
                    </p>
                  </div>
                  <div>
                    <p className="mt-2 text-sm text-slate-500">
                      {formatDateTime(expense.submittedAt || expense.dateTime || expense.date)}
                    </p>
                  </div>
                  <p className="text-lg font-black text-slate-950">
                    {currency.format(expense.amount)}
                  </p>
                  <div className="flex justify-start gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => startEdit(expense)}
                      className="btn-secondary"
                      aria-label="Edit expense"
                    >
                      <FaPen />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExpense(expense.id)}
                      className="btn-secondary text-red-600 hover:border-red-200 hover:bg-red-50"
                      aria-label="Delete expense"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

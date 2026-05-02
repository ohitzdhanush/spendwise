<<<<<<< HEAD
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
=======
import { useExpense } from "../context/ExpenseContext";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ExpenseList() {
  const { filtered, deleteExpense, updateExpense, loading } = useExpense();

  const [editId, setEditId] = useState(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const getIcon = (category) => {
    if (category === "Food") return "🍔";
    if (category === "Travel") return "✈️";
    if (category === "Bills") return "💡";
    return "💸";
  };

  const startEdit = (e) => {
    setEditId(e.id);
    setAmount(e.amount);
    setCategory(e.category);
  };

  const saveEdit = () => {
    updateExpense(editId, {
      amount: Number(amount),
      category,
    });
    setEditId(null);
  };

  if (loading) {
    return <p className="animate-pulse text-gray-400">Loading...</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      <h2 className="text-lg font-bold">Expenses</h2>

      {filtered.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        filtered.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            {editId === e.id ? (
              <>
                <input
                  value={amount}
                  onChange={(ev) => setAmount(ev.target.value)}
                  className="border p-2 rounded"
                />

                <select
                  value={category}
                  onChange={(ev) => setCategory(ev.target.value)}
                  className="border p-2 rounded"
                >
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Bills</option>
                </select>

                <button
                  onClick={saveEdit}
                  className="text-green-500 font-semibold"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div>
                  <p className="font-semibold">
                    {getIcon(e.category)} {e.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{e.amount}
                  </p>
                </div>

                <div className="space-x-3">
                  <button
                    onClick={() => startEdit(e)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
      )}
    </motion.div>
  );
}

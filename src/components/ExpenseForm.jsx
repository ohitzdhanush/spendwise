import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { categories } from "../constants/expenses";
import { useExpense } from "../context/useExpense";
import { riseIn } from "../utils/motion";

function toDateTimeInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function ExpenseForm() {
  const { addExpense, loading } = useExpense();
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    dateTime: toDateTimeInputValue(),
    note: "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    const submittedAt = new Date(form.dateTime).toISOString();

    addExpense({
      title: form.category,
      amount: Number(form.amount),
      category: form.category,
      date: submittedAt,
      dateTime: submittedAt,
      submittedAt,
      createdAt: submittedAt,
      note: form.note,
    });

    setForm({
      amount: "",
      category: "Food",
      dateTime: toDateTimeInputValue(),
      note: "",
    });
  };

  return (
    <motion.form onSubmit={handleSubmit} className="surface animated-panel p-4" variants={riseIn}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-950">Add Expense</h2>
          <p className="text-sm text-slate-500">Capture amount, category, date, and time.</p>
        </div>
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
        >
          <FaPlus className="h-3.5 w-3.5" />
          Add
        </motion.button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select
          className="field"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          className="field"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => updateField("amount", e.target.value)}
        />
        <input
          type="datetime-local"
          className="field"
          value={form.dateTime}
          onChange={(e) => updateField("dateTime", e.target.value)}
        />
        <input
          className="field sm:col-span-2"
          placeholder="Note"
          value={form.note}
          onChange={(e) => updateField("note", e.target.value)}
        />
      </div>
    </motion.form>
  );
}

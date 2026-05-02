import { useState } from "react";
<<<<<<< HEAD
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { categories } from "../constants/expenses";
import { useExpense } from "../context/useExpense";
import { riseIn } from "./Motion";

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
=======
import { useExpense } from "../context/ExpenseContext";

export default function ExpenseForm() {
  const { addExpense } = useExpense();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [focused, setFocused] = useState("");
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    const submittedAt = new Date(form.dateTime).toISOString();

<<<<<<< HEAD
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
=======
    // ✅ VALIDATION (VERY IMPORTANT)
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    addExpense({
      amount: numericAmount,          // ✅ always number
      category: category.trim(),      // ✅ clean string
    });

    setAmount("");
    setCategory("Food");
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  };

  // 🎨 Category colors
  const categoryColors = {
    Food: "bg-orange-500",
    Travel: "bg-blue-500",
    Bills: "bg-yellow-500",
  };

  return (
<<<<<<< HEAD
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
=======
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mt-4 transition"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        Add Expense
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* AMOUNT INPUT */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onFocus={() => setFocused("amount")}
            onBlur={() => setFocused("")}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 pt-6 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-700 
                       text-gray-800 dark:text-white 
                       focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <label
            className={`absolute left-3 transition-all text-gray-500 dark:text-gray-300
              ${
                amount || focused === "amount"
                  ? "top-1 text-xs text-blue-500"
                  : "top-4 text-sm"
              }`}
          >
            Amount
          </label>
        </div>

        {/* CATEGORY SELECT */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => setFocused("category")}
            onBlur={() => setFocused("")}
            className="w-full p-4 pt-6 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-700 
                       text-gray-800 dark:text-white
                       focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="Food">🍔 Food</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Bills">💡 Bills</option>
          </select>

          <label
            className={`absolute left-3 transition-all text-gray-500 dark:text-gray-300
              ${
                focused === "category"
                  ? "top-1 text-xs text-blue-500"
                  : "top-4 text-sm"
              }`}
          >
            Category
          </label>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 
                     text-white font-semibold rounded-xl px-4 py-3 
                     transition shadow-lg"
        >
          Add Expense
        </button>
      </div>

      {/* CATEGORY BADGE */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Selected:
        </span>

        <span
          className={`px-3 py-1 text-white rounded-full text-sm ${
            categoryColors[category]
          }`}
        >
          {category}
        </span>
      </div>
    </form>
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  );
}

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useExpense } from "../context/ExpenseContext";

export default function ExpenseForm() {
  const { addExpense } = useExpense();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [focused, setFocused] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    addExpense({
      amount: numericAmount,
      category: category.trim(),
      createdAt: new Date().toISOString(),
    });

    setAmount("");
    setCategory("Food");
  };

  const categoryColors = {
    Food: "bg-amber-500",
    Travel: "bg-sky-500",
    Bills: "bg-violet-500",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur transition dark:border-slate-800 dark:bg-slate-900/85 sm:p-6"
    >
      <h2 className="mb-5 text-xl font-extrabold text-slate-950 dark:text-white">
        Add Expense
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]">
        <div className="relative">
          <input
            type="number"
            value={amount}
            onFocus={() => setFocused("amount")}
            onBlur={() => setFocused("")}
            onChange={(e) => setAmount(e.target.value)}
            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pt-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <label
            className={`absolute left-4 transition-all text-slate-500 dark:text-slate-300 ${
              amount || focused === "amount"
                ? "top-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600"
                : "top-4 text-sm"
            }`}
          >
            Amount
          </label>
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => setFocused("category")}
            onBlur={() => setFocused("")}
            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pt-5 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
          </select>

          <label
            className={`absolute left-4 transition-all text-slate-500 dark:text-slate-300 ${
              focused === "category" || category
                ? "top-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600"
                : "top-4 text-sm"
            }`}
          >
            Category
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 md:min-w-40"
        >
          <FaPlus />
          Add Expense
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
          Selected:
        </span>

        <span className={`rounded-full px-3 py-1 text-sm font-bold text-white ${categoryColors[category]}`}>
          {category}
        </span>
      </div>
    </form>
  );
}

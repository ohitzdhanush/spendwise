import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";

export default function ExpenseForm() {
  const { addExpense } = useExpense();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [focused, setFocused] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

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
  };

  // 🎨 Category colors
  const categoryColors = {
    Food: "bg-orange-500",
    Travel: "bg-blue-500",
    Bills: "bg-yellow-500",
  };

  return (
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
  );
}
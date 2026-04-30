import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ChartSection from "./components/ChartSection";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(false);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const foodTotal = expenses
    .filter((e) => e.category === "Food")
    .reduce((sum, e) => sum + e.amount, 0);

  const travelTotal = expenses
    .filter((e) => e.category === "Travel")
    .reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((exp) => exp.category === filter);

  return (
    <div className={dark ? "dark flex min-h-screen" : "flex min-h-screen"}>
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <button
            onClick={() => setDark(!dark)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg dark:bg-white dark:text-black transition"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* 🎯 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: "Total", value: total, color: "text-green-500" },
            { label: "Food", value: foodTotal, color: "text-blue-500" },
            { label: "Travel", value: travelTotal, color: "text-purple-500" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-md"
            >
              <h2 className="text-gray-400">{card.label}</h2>
              <p className={`text-3xl font-bold ${card.color}`}>
                ₹{card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FORM */}
        <ExpenseForm addExpense={addExpense} />

        {/* FILTER */}
        <div className="mt-6">
          <select
            className="p-3 border rounded-lg dark:bg-gray-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Bills</option>
          </select>
        </div>

        {/* LIST */}
        <ExpenseList
          expenses={filteredExpenses}
          deleteExpense={deleteExpense}
        />

        {/* CHARTS */}
        <ChartSection expenses={expenses} />
      </div>
    </div>
  );
}
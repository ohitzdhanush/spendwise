import { useState } from "react";
import { FaRupeeSign, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ExpenseForm({ addExpense }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    const expense = {
      id: Date.now(),
      amount: Number(amount),
      category,
    };

    addExpense(expense);

    setAmount("");
    setCategory("Food");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg mt-6"
    >
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
        Add Expense
      </h2>

      {/* Amount Field */}
      <div className="relative mb-4">
        <FaRupeeSign className="absolute left-3 top-3 text-gray-400" />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full pl-10 p-3 border rounded-lg 
          bg-white text-black 
          dark:bg-gray-800 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
      </div>

      {/* Category Field */}
      <div className="relative mb-4">
        <FaTag className="absolute left-3 top-3 text-gray-400" />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full pl-10 p-3 border rounded-lg 
          bg-white text-black 
          dark:bg-gray-800 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
        </select>
      </div>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Add Expense
      </motion.button>
    </motion.form>
  );
}
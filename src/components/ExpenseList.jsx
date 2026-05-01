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
      )}
    </div>
  );
}
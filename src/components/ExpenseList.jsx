import { motion } from "framer-motion";

export default function ExpenseList({ expenses, deleteExpense }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <motion.li
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <span>{exp.category} - ₹{exp.amount}</span>

              <button
                onClick={() => deleteExpense(exp.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
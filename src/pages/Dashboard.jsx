import { useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import FilterBar from "../components/FilterBar";
import { useExpense } from "../context/ExpenseContext";

export default function Dashboard() {
  const {
    filtered,
    fetchExpenses,
    applyFilters,
    filters,
  } = useExpense();

  // 🔹 FETCH ONLY HERE
  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🔹 APPLY FILTERS WHEN CHANGED
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p className="text-xl mb-4">Total: ₹{total}</p>

      <ExpenseForm />
      <FilterBar />
      <ExpenseList />
    </div>
  );
}
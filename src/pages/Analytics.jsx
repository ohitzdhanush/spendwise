import { useEffect } from "react";
import ChartSection from "../components/ChartSection";
import { useExpense } from "../context/ExpenseContext";

export default function Analytics() {
  const { fetchExpenses, expenses, loading } = useExpense();

  useEffect(() => {
    fetchExpenses(); // ALWAYS fetch when opening analytics
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {expenses.length === 0 ? (
        <p className="text-gray-400">No data found</p>
      ) : (
        <ChartSection />
      )}
    </div>
  );
}
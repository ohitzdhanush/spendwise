import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";
import { useExpense } from "../context/ExpenseContext";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ChartSection() {
  const { expenses } = useExpense();

  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-4">
        No data for chart
      </p>
    );
  }

  const categories = ["Food", "Travel", "Bills"];

  const dataValues = categories.map((cat) =>
    expenses
      .filter(
        (e) =>
          e.category &&
          e.category.toLowerCase() === cat.toLowerCase()
      )
      .reduce((sum, e) => sum + Number(e.amount), 0)
  );

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: dataValues,
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-white mb-2">Category Distribution</h2>
        <Pie data={pieData} />
      </div>

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-white mb-2">Spending Overview</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
<<<<<<< HEAD
=======
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";
import { useExpense } from "../context/ExpenseContext";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { categories } from "../constants/expenses";
import { riseIn } from "./Motion";

<<<<<<< HEAD
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
=======
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
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

const palette = ["#0891b2", "#4f46e5", "#0f766e", "#9333ea", "#e11d48", "#2563eb", "#64748b"];

export default function ChartSection({ expenses, compact = false }) {
  const totals = categories.map((category) =>
    expenses
<<<<<<< HEAD
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
=======
      .filter(
        (e) =>
          e.category &&
          e.category.toLowerCase() === cat.toLowerCase()
      )
      .reduce((sum, e) => sum + Number(e.amount), 0)
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  );

  const hasData = totals.some((value) => value > 0);
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: palette,
        borderColor: "#ffffff",
        borderWidth: 3,
        borderRadius: 6,
      },
    ],
  };

<<<<<<< HEAD
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          useBorderRadius: true,
          font: { family: "Inter" },
        },
=======
  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: dataValues,
        backgroundColor: "#6366f1",
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
      },
    },
  };

  if (!hasData) {
    return (
      <motion.div className="surface grid min-h-72 place-items-center p-6 text-center" variants={riseIn}>
        <div>
          <p className="font-bold text-slate-950">Charts are waiting for data</p>
          <p className="mt-1 text-sm text-slate-500">
            Add expenses and category insights will appear here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
<<<<<<< HEAD
    <div className={`grid gap-4 ${compact ? "lg:grid-cols-2" : "lg:grid-cols-2"}`}>
      <motion.div className="surface animated-panel p-4" variants={riseIn}>
        <h2 className="font-bold text-slate-950">Category Share</h2>
        <div className="chart-pop mt-4 h-72">
          <Doughnut data={chartData} options={options} />
        </div>
      </motion.div>

      <motion.div className="surface animated-panel p-4" variants={riseIn}>
        <h2 className="font-bold text-slate-950">Spend by Category</h2>
        <div className="chart-pop mt-4 h-72">
          <Bar
            data={chartData}
            options={{
              ...options,
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: "#e2e8f0" } },
              },
            }}
          />
        </div>
      </motion.div>
=======
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-white mb-2">Category Distribution</h2>
        <Pie data={pieData} />
      </div>

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-white mb-2">Spending Overview</h2>
        <Bar data={barData} />
      </div>
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
    </div>
  );
}

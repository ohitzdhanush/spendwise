import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { categories } from "../constants/expenses";
import { riseIn } from "../utils/motion";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const palette = ["#0891b2", "#4f46e5", "#0f766e", "#9333ea", "#e11d48", "#2563eb", "#64748b"];

export default function ChartSection({ expenses, compact = false }) {
  const totals = categories.map((category) =>
    expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
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
    </div>
  );
}

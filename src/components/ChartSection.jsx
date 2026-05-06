import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useExpense } from "../context/ExpenseContext";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartSection() {
  const { expenses } = useExpense();

  if (!expenses || expenses.length === 0) {
    return (
      <p className="mt-4 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No data for chart.
      </p>
    );
  }

  const categories = ["Food", "Travel", "Bills"];

  const dataValues = categories.map((category) =>
    expenses
      .filter((expense) => expense.category?.toLowerCase() === category.toLowerCase())
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  );

  const colors = ["#f59e0b", "#0ea5e9", "#8b5cf6"];

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 4,
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: dataValues,
        backgroundColor: colors,
        borderRadius: 14,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          color: "#475569",
          font: { family: "Inter", weight: "600" },
        },
      },
    },
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Category distribution">
        <Pie data={pieData} options={options} />
      </ChartCard>

      <ChartCard title="Spending overview">
        <Bar data={barData} options={options} />
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 sm:p-5">
      <h2 className="mb-4 text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>
      <div className="h-72 sm:h-80">{children}</div>
    </div>
  );
}

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

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ChartSection({ expenses }) {
  const categories = ["Food", "Travel", "Bills"];

  const dataValues = categories.map((cat) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
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
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Category Distribution</h2>
        <Pie data={pieData} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Spending Overview</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}
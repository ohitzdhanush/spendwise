import { FaHome, FaList, FaChartPie } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">SpendWise</h2>

      <ul className="space-y-4">
        <li className="flex items-center gap-3 hover:text-gray-300 cursor-pointer">
          <FaHome /> Dashboard
        </li>

        <li className="flex items-center gap-3 hover:text-gray-300 cursor-pointer">
          <FaList /> Transactions
        </li>

        <li className="flex items-center gap-3 hover:text-gray-300 cursor-pointer">
          <FaChartPie /> Analytics
        </li>
      </ul>
    </div>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaList, FaChartPie, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5 flex flex-col justify-between">
      
      <div>
        <h2 className="text-2xl font-bold mb-8">SpendWise</h2>

        <ul className="space-y-5">
          <li>
            <Link to="/" className="flex items-center gap-3 hover:text-gray-300">
              <FaHome /> Dashboard
            </Link>
          </li>

          <li>
            <Link to="/transactions" className="flex items-center gap-3 hover:text-gray-300">
              <FaList /> Transactions
            </Link>
          </li>

          <li>
            <Link to="/analytics" className="flex items-center gap-3 hover:text-gray-300">
              <FaChartPie /> Analytics
            </Link>
          </li>
        </ul>
      </div>

      {/* USER SECTION */}
      <div className="mt-10 border-t border-gray-700 pt-4">
        <p className="text-sm mb-2">👤 {user?.email}</p>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}
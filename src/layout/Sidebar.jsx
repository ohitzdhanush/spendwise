import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaWallet, FaChartPie, FaList, FaHome } from "react-icons/fa";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg transition ${
      isActive
        ? "bg-blue-500 text-white"
        : "hover:bg-blue-100 dark:hover:bg-gray-700"
    }`;

  return (
    <aside className="w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r hidden md:flex flex-col">

      <div className="p-5 text-2xl font-bold flex items-center gap-2">
        <FaWallet className="text-blue-500" />
        Spendwise
      </div>

      <nav className="flex flex-col gap-2 px-4">
        <NavLink to="/" className={linkClass}>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/analytics" className={linkClass}>
          <FaChartPie /> Analytics
        </NavLink>

        <NavLink to="/transactions" className={linkClass}>
          <FaList /> Transactions
        </NavLink>
      </nav>

      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
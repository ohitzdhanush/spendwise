import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/transactions">Transactions</Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
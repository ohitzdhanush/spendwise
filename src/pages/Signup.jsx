import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaWallet } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    const success = signup(email, password);

    if (success) {
      navigate("/login");
    } else {
      alert("Account already exists");
    }
  };

  return (
    <main className="animated-grid flex min-h-screen items-center justify-center bg-[#eef4f8] px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/15 sm:p-8"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="soft-shine flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
            <FaWallet />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-950">SpendWise</p>
            <p className="text-sm font-medium text-slate-500">Create your workspace</p>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-950">Signup</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Start tracking your expenses in minutes.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            type="button"
            onClick={handleSignup}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-extrabold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            Create Account <FaArrowRight />
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold text-emerald-700">
            Login
          </Link>
        </p>
      </motion.section>
    </main>
  );
}

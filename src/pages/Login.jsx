import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaWallet } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const success = login(email, password);

    if (success) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="animated-grid flex min-h-screen items-center justify-center bg-[#eef4f8] px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/15 lg:grid-cols-[1fr_0.9fr]"
      >
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="soft-shine flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
              <FaWallet />
            </div>
            <span className="text-xl font-extrabold">SpendWise</span>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Welcome back
            </p>
            <h1 className="mt-3 text-4xl font-extrabold">
              Your spending dashboard is ready.
            </h1>
            <p className="mt-4 text-slate-300">
              Sign in to manage expenses, filters, transactions, and analytics from any screen size.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <FaWallet />
            </div>
            <span className="text-xl font-extrabold text-slate-950">SpendWise</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-950">Login</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Continue to your expense workspace.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              onClick={handleLogin}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-extrabold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              Login <FaArrowRight />
            </button>
          </div>

          <p className="mt-6 text-center text-sm font-medium text-slate-500">
            No account?{" "}
            <Link to="/signup" className="font-extrabold text-emerald-700">
              Create one
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}

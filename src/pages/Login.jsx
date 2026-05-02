import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaWallet } from "react-icons/fa6";
import { MotionPage } from "../components/Motion";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);

    if (result.ok) {
      navigate("/");
      return;
    }

    setMessage(result.message);
  };

  return (
    <MotionPage className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="auth-motion-bg relative hidden overflow-hidden px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <motion.div
            className="float-soft absolute right-14 top-16 h-28 w-28 rounded-full border border-cyan-300/20 bg-cyan-300/10"
            aria-hidden="true"
          />
          <motion.div
            className="float-soft absolute bottom-28 left-12 h-20 w-20 rounded-full border border-indigo-300/20 bg-indigo-300/10"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <motion.div
              className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-500"
              whileHover={{ rotate: -8, scale: 1.06 }}
            >
              <FaWallet />
            </motion.div>
            <span className="text-xl font-black">SpendWise</span>
          </div>
          <motion.div
            className="relative max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
              Smarter expense tracking
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight">
              Know what you spend before the month surprises you.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              A clean dashboard for daily expenses, category trends, and fast editing.
            </p>
          </motion.div>
          <div className="relative grid grid-cols-3 gap-3">
            {["Fast logging", "Visual insights", "Render ready"].map((item) => (
              <motion.div
                key={item}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold backdrop-blur"
                whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10">
          <motion.form
            onSubmit={handleLogin}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-cyan-950/5"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-8 lg:hidden">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-600 text-white">
                <FaWallet />
              </div>
              <p className="mt-3 text-2xl font-black">SpendWise</p>
            </div>
            <h2 className="text-2xl font-black text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to open your expense workspace.
            </p>

            {message && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {message}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <input
                className="field"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary mt-5 w-full">
              Login
              <FaArrowRight className="h-3.5 w-3.5" />
            </button>

            <p className="mt-5 text-center text-sm text-slate-500">
              No account?{" "}
              <Link to="/signup" className="font-bold text-cyan-700 hover:text-cyan-800">
                Create one
              </Link>
            </p>
          </motion.form>
        </section>
      </div>
    </MotionPage>
  );
}

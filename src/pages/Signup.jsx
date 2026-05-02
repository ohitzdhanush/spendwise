import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaWallet } from "react-icons/fa6";
import { MotionPage } from "../components/Motion";
import { useAuth } from "../context/useAuth";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    const result = signup(email, password);

    if (result.ok) {
      navigate("/login");
      return;
    }

    setMessage(result.message);
  };

  return (
    <MotionPage className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center px-4 py-10">
          <motion.form
            onSubmit={handleSignup}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-cyan-950/5"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-600 text-white">
              <FaWallet />
            </div>
            <h2 className="mt-6 text-2xl font-black text-slate-950">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Start tracking expenses with a local frontend session.
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
              Sign up
              <FaArrowRight className="h-3.5 w-3.5" />
            </button>

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-cyan-700 hover:text-cyan-800">
                Login
              </Link>
            </p>
          </motion.form>
        </section>

        <section className="auth-motion-bg relative hidden overflow-hidden px-10 py-12 text-white lg:flex lg:flex-col lg:justify-end">
          <motion.div
            className="float-soft absolute left-16 top-20 h-24 w-24 rounded-full border border-cyan-300/20 bg-cyan-300/10"
            aria-hidden="true"
          />
          <motion.div
            className="float-soft absolute bottom-20 right-16 h-32 w-32 rounded-full border border-indigo-300/20 bg-indigo-300/10"
            aria-hidden="true"
          />
          <motion.div
            className="relative max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
              Built for clarity
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight">
              Turn every transaction into a better decision.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Your Render backend powers the expense data while this frontend keeps it fast and beautiful.
            </p>
          </motion.div>
        </section>
      </div>
    </MotionPage>
  );
}

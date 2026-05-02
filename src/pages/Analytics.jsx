<<<<<<< HEAD
import { motion } from "framer-motion";
import ChartSection from "../components/ChartSection";
import { MotionPage } from "../components/Motion";
import { useExpense } from "../context/useExpense";
import { riseIn, staggerContainer } from "../utils/motion";

export default function Analytics() {
  const { expenses } = useExpense();

  return (
    <MotionPage className="page-shell">
      <motion.header variants={staggerContainer} initial="initial" animate="animate">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">
          Insights
        </p>
        <motion.h1 variants={riseIn} className="mt-2 text-3xl font-black text-slate-950">
          Analytics
        </motion.h1>
        <motion.p variants={riseIn} className="mt-2 max-w-2xl text-slate-600">
          Understand where your money goes by category and recent activity.
        </motion.p>
      </motion.header>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <ChartSection expenses={expenses} />
      </motion.div>
    </MotionPage>
  );
}
=======
import { useEffect } from "react";
import ChartSection from "../components/ChartSection";
import { useExpense } from "../context/ExpenseContext";

export default function Analytics() {
  const { fetchExpenses, expenses, loading } = useExpense();

  useEffect(() => {
    fetchExpenses(); // ALWAYS fetch when opening analytics
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {expenses.length === 0 ? (
        <p className="text-gray-400">No data found</p>
      ) : (
        <ChartSection />
      )}
    </div>
  );
}
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

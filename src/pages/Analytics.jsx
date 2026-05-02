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

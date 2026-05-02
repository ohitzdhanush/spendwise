<<<<<<< HEAD
import { motion } from "framer-motion";
import ExpenseList from "../components/ExpenseList";
import FilterBar from "../components/FilterBar";
import { MotionPage } from "../components/Motion";
import { useExpense } from "../context/useExpense";
import { riseIn, staggerContainer } from "../utils/motion";

export default function Transactions() {
  const { filtered } = useExpense();

  return (
    <MotionPage className="page-shell">
      <motion.header variants={staggerContainer} initial="initial" animate="animate">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">
          Ledger
        </p>
        <motion.h1 variants={riseIn} className="mt-2 text-3xl font-black text-slate-950">
          Transactions
        </motion.h1>
        <motion.p variants={riseIn} className="mt-2 text-slate-600">
          Review, edit, and remove expenses with quick filters.
        </motion.p>
      </motion.header>

      <motion.div
        className="mt-6 space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <FilterBar />
        <motion.div variants={riseIn} className="text-sm font-semibold text-slate-500">
          Showing {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
        </motion.div>
        <ExpenseList />
      </motion.div>
    </MotionPage>
  );
}
=======
    export default function Transactions() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Transactions Page</h1>
      <p>All your expenses will appear here.</p>
    </div>
  );
}
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

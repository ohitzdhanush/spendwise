import { FaArrowTrendUp, FaCalendarDay, FaIndianRupeeSign, FaWallet } from "react-icons/fa6";
import { motion } from "framer-motion";
import ChartSection from "../components/ChartSection";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import FilterBar from "../components/FilterBar";
import LiveClock from "../components/LiveClock";
import { MotionCard, MotionPage } from "../components/Motion";
import { useExpense } from "../context/useExpense";
import { riseIn, staggerContainer } from "../utils/motion";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <MotionCard className="surface animated-panel p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
          <Icon />
        </div>
      </div>
    </MotionCard>
  );
}

export default function Dashboard() {
  const { expenses, filtered, error, loading, usingDemoData, refreshExpenses } = useExpense();
  const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
  const average = filtered.length ? total / filtered.length : 0;
  const largest = filtered.reduce((max, expense) => Math.max(max, expense.amount), 0);
  const today = new Date().toDateString();
  const todayTotal = filtered
    .filter((expense) => new Date(expense.date).toDateString() === today)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const tickerItems = [
    `${filtered.length} tracked`,
    `${currency.format(total)} filtered`,
    `${currency.format(average)} average`,
    `${currency.format(largest)} largest`,
  ];

  return (
    <MotionPage className="page-shell">
      <motion.header
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={riseIn}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">
            Personal finance
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
            Spending Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Track expenses, filter cash flow, and spot category patterns in one clean workspace.
          </p>
        </motion.div>
        <motion.div className="flex flex-col gap-3 sm:items-end" variants={riseIn}>
          <LiveClock compact />
          <motion.button
            type="button"
            onClick={refreshExpenses}
            className="btn-secondary"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            Refresh
          </motion.button>
        </motion.div>
      </motion.header>

      <motion.div
        className="surface mt-5 overflow-hidden px-4 py-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <div className="ticker-lane flex w-max gap-3 text-sm font-bold text-slate-600">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      {(error || usingDemoData) && (
        <motion.div
          className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <motion.section
        className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <StatCard
          label="Filtered Spend"
          value={currency.format(total)}
          helper={`${filtered.length} of ${expenses.length} transactions`}
          icon={FaIndianRupeeSign}
        />
        <StatCard
          label="Average Expense"
          value={currency.format(average)}
          helper="Based on current filters"
          icon={FaArrowTrendUp}
        />
        <StatCard
          label="Today"
          value={currency.format(todayTotal)}
          helper="Expenses logged today"
          icon={FaCalendarDay}
        />
        <StatCard
          label="Largest Entry"
          value={currency.format(largest)}
          helper="Highest single spend"
          icon={FaWallet}
        />
      </motion.section>

      <motion.section
        className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <ExpenseForm />
        <ChartSection expenses={filtered} compact />
      </motion.section>

      <motion.section
        className="mt-6 space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <FilterBar />
        <ExpenseList limit={6} />
      </motion.section>
    </MotionPage>
  );
}

import { FaMagnifyingGlass, FaSliders } from "react-icons/fa6";
import { useExpense } from "../context/ExpenseContext";

export default function FilterBar() {
  const { filters, setFilters } = useExpense();

  return (
    <div className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
        <FaSliders className="text-emerald-600" />
        Filter expenses
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </label>

        <select
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
        </select>

        <input
          type="number"
          placeholder="Min amount"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800"
          onChange={(e) => setFilters({ ...filters, min: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max amount"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800"
          onChange={(e) => setFilters({ ...filters, max: e.target.value })}
        />
      </div>
    </div>
  );
}

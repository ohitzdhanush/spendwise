import { FaRedo, FaSearch } from "react-icons/fa";
import { FaCircleCheck, FaTriangleExclamation } from "react-icons/fa6";
import { motion } from "framer-motion";
import { categories } from "../constants/expenses";
import { useExpense } from "../context/useExpense";
import { riseIn } from "../utils/motion";

export default function FilterBar() {
  const { filters, filterValidation, setFilters } = useExpense();

  const updateFilter = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    setFilters({ category: "All", min: "", max: "", search: "" });
  };

  return (
    <motion.div className="surface animated-panel p-4" variants={riseIn}>
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_0.75fr_0.75fr_auto]">
        <label className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, category, or note"
            className="field pl-9"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </label>

        <select
          className="field"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option>All</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <label>
          <span className="sr-only">Minimum amount</span>
          <input
            type="number"
            min="0"
            placeholder="Min"
            className={`field ${!filterValidation.ok ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
            value={filters.min}
            onChange={(e) => updateFilter("min", e.target.value)}
          />
        </label>

        <label>
          <span className="sr-only">Maximum amount</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            className={`field ${!filterValidation.ok ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
            value={filters.max}
            onChange={(e) => updateFilter("max", e.target.value)}
          />
        </label>

        <button type="button" onClick={resetFilters} className="btn-secondary">
          <FaRedo className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
      <motion.div
        className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
          filterValidation.ok
            ? "bg-cyan-50 text-cyan-800"
            : "bg-rose-50 text-rose-700"
        }`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        key={filterValidation.message}
      >
        {filterValidation.ok ? <FaCircleCheck /> : <FaTriangleExclamation />}
        {filterValidation.message}
      </motion.div>
    </motion.div>
  );
}

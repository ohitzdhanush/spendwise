import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { ExpenseService } from "../api/expenseService";
import {
  getCache,
  setCache,
  peekCache,
  invalidateCache,
} from "../api/cache";

const ExpenseContext = createContext();

const CACHE_KEY = "expenses";
const CACHE_TTL = 60000; // 60s

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: "All",
    min: "",
    max: "",
    search: "",
  });

  // 🔹 FETCH with cache + SWR
  const fetchExpenses = async ({ force = false } = {}) => {
    try {
      setLoading(true);

      // 1) Serve fresh cache if available
      const cached = getCache(CACHE_KEY);
      if (!force && cached) {
        setExpenses(cached);
        setFiltered(cached);
        setLoading(false);
        return;
      }

      // 2) Show stale data instantly (if exists)
      const stale = peekCache(CACHE_KEY);
      if (!force && stale) {
        setExpenses(stale);
        setFiltered(stale);
        // continue to revalidate in background
      }

      // 3) Fetch from API with retry (Render wake-up)
      let data;
      let success = false;

      for (let i = 0; i < 3; i++) {
        try {
          data = await ExpenseService.getAll();
          success = true;
          break;
        } catch {
          await new Promise((res) => setTimeout(res, 2000));
        }
      }

      if (!success) throw new Error("API failed after retries");

      // 4) Update state + cache
      setExpenses(data);
      setFiltered(data);
      setCache(CACHE_KEY, data, CACHE_TTL);

    } catch (e) {
      toast.error("Failed to load data ❌");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FILTER APPLY
  const applyFilters = () => {
    let data = [...expenses];

    if (filters.category !== "All") {
      data = data.filter((e) => e.category === filters.category);
    }

    if (filters.min) {
      data = data.filter((e) => e.amount >= Number(filters.min));
    }

    if (filters.max) {
      data = data.filter((e) => e.amount <= Number(filters.max));
    }

    if (filters.search) {
      data = data.filter((e) =>
        e.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFiltered(data);
  };

  // 🔹 ADD
  const addExpense = async (expense) => {
    const t = toast.loading("Adding...");
    try {
      await ExpenseService.create(expense);
      toast.success("Added 💸", { id: t });

      invalidateCache(CACHE_KEY); // 🧹 bust cache
      fetchExpenses({ force: true });

    } catch {
      toast.error("Failed ❌", { id: t });
    }
  };

  // 🔹 UPDATE
  const updateExpense = async (id, updated) => {
    const t = toast.loading("Updating...");
    try {
      await ExpenseService.update(id, updated);
      toast.success("Updated ✨", { id: t });

      invalidateCache(CACHE_KEY);
      fetchExpenses({ force: true });

    } catch {
      toast.error("Update failed ❌", { id: t });
    }
  };

  // 🔹 DELETE
  const deleteExpense = async (id) => {
    const t = toast.loading("Deleting...");
    try {
      await ExpenseService.remove(id);
      toast.success("Deleted 🗑️", { id: t });

      invalidateCache(CACHE_KEY);
      fetchExpenses({ force: true });

    } catch {
      toast.error("Delete failed ❌", { id: t });
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filtered,
        filters,
        setFilters,
        applyFilters,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  return useContext(ExpenseContext);
}
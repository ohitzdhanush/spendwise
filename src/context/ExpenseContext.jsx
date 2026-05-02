<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import { categories } from "../constants/expenses";
import { ExpenseContext } from "./expense-context";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const EXPENSES_URL = `${API_BASE.replace(/\/$/, "")}/expenses`;

const fallbackExpenses = [
  {
    id: "demo-1",
    title: "Grocery run",
    amount: 1280,
    category: "Food",
    date: new Date().toISOString(),
    note: "Weekly essentials",
  },
  {
    id: "demo-2",
    title: "Metro card",
    amount: 450,
    category: "Travel",
    date: new Date(Date.now() - 86400000).toISOString(),
    note: "Commute top-up",
  },
  {
    id: "demo-3",
    title: "Electricity bill",
    amount: 2100,
    category: "Bills",
    date: new Date(Date.now() - 172800000).toISOString(),
    note: "Home utilities",
  },
];

function loadExpenseMeta() {
  try {
    return JSON.parse(localStorage.getItem("spendwiseExpenseMeta") || "{}");
  } catch {
    return {};
  }
}

function saveExpenseMeta(id, expense) {
  if (!id) return;
  const meta = loadExpenseMeta();
  meta[id] = {
    title: expense.title,
    note: expense.note,
    submittedAt: expense.submittedAt,
    dateTime: expense.dateTime,
    createdAt: expense.createdAt,
  };
  localStorage.setItem("spendwiseExpenseMeta", JSON.stringify(meta));
}

function removeExpenseMeta(id) {
  const meta = loadExpenseMeta();
  delete meta[id];
  localStorage.setItem("spendwiseExpenseMeta", JSON.stringify(meta));
}

function normalizeCategory(value) {
  const match = categories.find(
    (category) => category.toLowerCase() === String(value || "").toLowerCase()
  );
  return match || "Other";
}

function normalizeExpense(expense) {
  const id = expense.id || expense._id || crypto.randomUUID();
  const category = normalizeCategory(expense.category);
  const stored = loadExpenseMeta()[id] || {};
  const submittedAt =
    expense.submittedAt ||
    expense.dateTime ||
    expense.createdAt ||
    expense.date ||
    stored.submittedAt ||
    stored.dateTime ||
    stored.createdAt ||
    new Date().toISOString();
  return {
    ...expense,
    id,
    amount: Number(expense.amount || 0),
    category,
    title:
      expense.title ||
      stored.title ||
      expense.name ||
      expense.description ||
      category ||
      "Expense",
    date: submittedAt,
    dateTime: submittedAt,
    submittedAt,
    createdAt: expense.createdAt || submittedAt,
    note: expense.note || stored.note || expense.description || "",
  };
}

function validateFilters(filters) {
  const min = filters.min === "" ? null : Number(filters.min);
  const max = filters.max === "" ? null : Number(filters.max);

  if ((min !== null && Number.isNaN(min)) || (max !== null && Number.isNaN(max))) {
    return { ok: false, message: "Amount filters must be valid numbers." };
  }

  if ((min !== null && min < 0) || (max !== null && max < 0)) {
    return { ok: false, message: "Amount filters cannot be negative." };
  }

  if (min !== null && max !== null && min > max) {
    return { ok: false, message: "Minimum amount cannot be greater than maximum amount." };
  }

  return { ok: true, message: "Filters look correct." };
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);
=======
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

>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  const [filters, setFilters] = useState({
    category: "All",
    min: "",
    max: "",
    search: "",
  });
<<<<<<< HEAD
  const filterValidation = useMemo(() => validateFilters(filters), [filters]);

  const filtered = useMemo(() => {
    if (!filterValidation.ok) return [];

    return expenses.filter((expense) => {
      const searchText = `${expense.title} ${expense.category} ${expense.note}`.toLowerCase();
      const matchesSearch = filters.search
        ? searchText.includes(filters.search.toLowerCase())
        : true;
      const matchesCategory =
        filters.category === "All" || expense.category === filters.category;
      const matchesMin = filters.min ? expense.amount >= Number(filters.min) : true;
      const matchesMax = filters.max ? expense.amount <= Number(filters.max) : true;

      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });
  }, [expenses, filters, filterValidation.ok]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(EXPENSES_URL);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.expenses || data.data || [];
      setExpenses(list.map(normalizeExpense));
      setUsingDemoData(false);
    } catch {
      setExpenses(fallbackExpenses.map(normalizeExpense));
      setUsingDemoData(true);
      setError("Backend is not reachable yet. Showing demo data.");
=======

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
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchExpenses();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const addExpense = async (expense) => {
    const optimistic = normalizeExpense(expense);
    saveExpenseMeta(optimistic.id, optimistic);
    setExpenses((current) => [optimistic, ...current]);

    try {
      setLoading(true);
      setError("");
      const res = await fetch(EXPENSES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      if (!res.ok) throw new Error("Request failed");
      let saved = null;
      try {
        saved = await res.json();
      } catch {
        saved = null;
      }

      if (saved && !Array.isArray(saved)) {
        const savedExpense = normalizeExpense({
          ...saved,
          title: optimistic.title,
          note: optimistic.note,
          date: optimistic.date,
          dateTime: optimistic.dateTime,
          submittedAt: optimistic.submittedAt,
          createdAt: optimistic.createdAt,
        });
        saveExpenseMeta(savedExpense.id, savedExpense);
        setExpenses((current) =>
          current.map((item) => (item.id === optimistic.id ? savedExpense : item))
        );
      } else {
        await fetchExpenses();
      }
    } catch {
      setUsingDemoData(true);
      setError("Saved locally for preview. Connect your Render API to persist it.");
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, updated) => {
    const normalizedUpdate = normalizeExpense({ ...updated, id });
    saveExpenseMeta(id, normalizedUpdate);
    setExpenses((current) =>
      current.map((expense) =>
        expense.id === id ? normalizeExpense({ ...expense, ...updated, id }) : expense
      )
    );

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${EXPENSES_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Request failed");
      await fetchExpenses();
    } catch {
      setError("Updated in the interface. Backend persistence failed.");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    removeExpenseMeta(id);
    setExpenses((current) => current.filter((expense) => expense.id !== id));

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${EXPENSES_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Request failed");
      await fetchExpenses();
    } catch {
      setError("Removed in the interface. Backend delete failed.");
    } finally {
      setLoading(false);
=======
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
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filtered,
        filters,
<<<<<<< HEAD
        filterValidation,
        setFilters,
=======
        setFilters,
        applyFilters,
        fetchExpenses,
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
        addExpense,
        updateExpense,
        deleteExpense,
        loading,
<<<<<<< HEAD
        error,
        usingDemoData,
        refreshExpenses: fetchExpenses,
=======
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
<<<<<<< HEAD
=======

export function useExpense() {
  return useContext(ExpenseContext);
}
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

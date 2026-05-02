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
  const [filters, setFilters] = useState({
    category: "All",
    min: "",
    max: "",
    search: "",
  });
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
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filtered,
        filters,
        filterValidation,
        setFilters,
        addExpense,
        updateExpense,
        deleteExpense,
        loading,
        error,
        usingDemoData,
        refreshExpenses: fetchExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ExpenseService } from "../api/expenseService";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext();

const defaultFilters = {
  search: "",
  category: "All",
  min: "",
  max: "",
};

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    return expenses.filter((expense) => {
      const amount = Number(expense.amount || 0);
      const category = expense.category || "";
      const matchesSearch = category
        .toLowerCase()
        .includes(filters.search.trim().toLowerCase());
      const matchesCategory =
        filters.category === "All" || category === filters.category;
      const matchesMin = filters.min === "" || amount >= Number(filters.min);
      const matchesMax = filters.max === "" || amount <= Number(filters.max);

      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    if (!user?.id) {
      setExpenses([]);
      return;
    }

    setLoading(true);
    try {
      const data = await ExpenseService.getAll(user.id);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Could not load expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense) => {
    if (!user?.id) return;

    try {
      const saved = await ExpenseService.create(expense, user.id);
      setExpenses((current) => [saved, ...current]);
      toast.success("Expense added");
    } catch (error) {
      console.error(error);
      toast.error("Could not add expense");
    }
  };

  const updateExpense = async (id, expense) => {
    if (!user?.id) return;

    try {
      const saved = await ExpenseService.update(id, expense, user.id);
      setExpenses((current) =>
        current.map((item) => (item.id === id ? saved : item))
      );
      toast.success("Expense updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update expense");
    }
  };

  const deleteExpense = async (id) => {
    if (!user?.id) return;

    try {
      await ExpenseService.remove(id, user.id);
      setExpenses((current) => current.filter((item) => item.id !== id));
      toast.success("Expense deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete expense");
    }
  };

  const applyFilters = () => {
    // Filtering is derived in `filtered`; this keeps older component calls valid.
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filtered,
        filters,
        setFilters,
        loading,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        applyFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }

  return context;
}

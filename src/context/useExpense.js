import { useContext } from "react";
import { ExpenseContext } from "./expense-context";

export function useExpense() {
  return useContext(ExpenseContext);
}

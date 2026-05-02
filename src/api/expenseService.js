import { apiRequest } from "./client";

export const ExpenseService = {
  getAll: () => apiRequest("/expenses"),

  create: (data) =>
    apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id) =>
    apiRequest(`/expenses/${id}`, {
      method: "DELETE",
    }),
};
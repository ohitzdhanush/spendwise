import { apiRequest } from "./client";

const userQuery = (userId) => `userId=${encodeURIComponent(userId)}`;

export const ExpenseService = {
  getAll: (userId) => apiRequest(`/expenses?${userQuery(userId)}`),

  create: (data, userId) =>
    apiRequest(`/expenses?${userQuery(userId)}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data, userId) =>
    apiRequest(`/expenses/${id}?${userQuery(userId)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id, userId) =>
    apiRequest(`/expenses/${id}?${userQuery(userId)}`, {
      method: "DELETE",
    }),
};

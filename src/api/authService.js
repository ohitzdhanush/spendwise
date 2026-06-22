import { apiRequest } from "./client";

export const AuthService = {
  login: (data) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signup: (data) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  firebaseLogin: (idToken) =>
    apiRequest("/auth/firebase", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),
};

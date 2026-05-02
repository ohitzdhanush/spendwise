import { useState } from "react";
import { AuthContext } from "./auth-context";

function getStoredUser() {
  return JSON.parse(localStorage.getItem("spendwiseUser") || "null");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const signup = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 6) {
      return { ok: false, message: "Use a valid email and 6+ character password." };
    }

    const users = JSON.parse(localStorage.getItem("spendwiseUsers") || "[]");
    const exists = users.some((item) => item.email === normalizedEmail);

    if (exists) {
      return { ok: false, message: "An account with this email already exists." };
    }

    users.push({ email: normalizedEmail, password });
    localStorage.setItem("spendwiseUsers", JSON.stringify(users));
    return { ok: true };
  };

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem("spendwiseUsers") || "[]");
    const found = users.find(
      (item) => item.email === normalizedEmail && item.password === password
    );

    if (!found) {
      return { ok: false, message: "Email or password is incorrect." };
    }

    const session = { email: found.email };
    localStorage.setItem("spendwiseUser", JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("spendwiseUser");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

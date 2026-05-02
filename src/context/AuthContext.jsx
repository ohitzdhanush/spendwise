<<<<<<< HEAD
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
=======
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem("currentUser"));
      if (current) setUser(current);
    } catch {
      setUser(null);
    }
  }, []);

  const signup = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === email);
    if (exists) return false;

    const newUser = { email, password };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      setUser(found);
      return true;
    }

    return false;
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  };

  const logout = () => {
    setUser(null);
<<<<<<< HEAD
    localStorage.removeItem("spendwiseUser");
=======
    localStorage.removeItem("currentUser");
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
<<<<<<< HEAD
=======

export function useAuth() {
  return useContext(AuthContext);
}
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../api/authService";

const AuthContext = createContext();
const STORAGE_KEY = "currentUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (current?.id && current?.email) {
        setUser(current);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const signup = async (email, password) => {
    try {
      await AuthService.signup({
        email: email.trim().toLowerCase(),
        password,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const loggedInUser = await AuthService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

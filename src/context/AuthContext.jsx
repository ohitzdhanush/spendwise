import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../api/authService";
import { setAuthTokenProvider } from "../api/authToken";
import {
  auth,
  authPersistenceReady,
  createUserWithEmailAndPassword,
  getRedirectResult,
  googleProvider,
  isFirebaseConfigured,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "../firebase";

const AuthContext = createContext();
const STORAGE_KEY = "currentUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const syncFirebaseUser = async (firebaseUser) => {
    if (!isFirebaseConfigured || !firebaseUser) {
      throw new Error("Firebase is not configured");
    }

    const idToken = await firebaseUser.getIdToken();
    const appUser = await AuthService.firebaseLogin(idToken);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));
    setUser(appUser);
    return appUser;
  };

  useEffect(() => {
    setAuthTokenProvider(async () => {
      if (!auth?.currentUser) {
        return null;
      }

      return auth.currentUser.getIdToken();
    });

    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (current?.id && current?.email) {
        setUser(current);
      }
    } catch {
      setUser(null);
    }

    if (!isFirebaseConfigured) {
      return;
    }

    authPersistenceReady.catch((error) => {
      console.error(error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        return;
      }

      try {
        await syncFirebaseUser(firebaseUser);
      } catch (error) {
        console.error(error);
      }
    });

    authPersistenceReady
      .then(() => getRedirectResult(auth))
      .then(async (result) => {
        if (result?.user) {
          await syncFirebaseUser(result.user);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    try {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase is not configured");
      }

      await authPersistenceReady;
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await syncFirebaseUser(credentials.user);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase is not configured");
      }

      await authPersistenceReady;
      const credentials = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await syncFirebaseUser(credentials.user);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase is not configured");
      }

      await authPersistenceReady;
      await signInWithRedirect(auth, googleProvider);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

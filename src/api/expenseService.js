import {
  addDoc,
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  isFirebaseConfigured,
  orderBy,
  query,
  updateDoc,
} from "../firebase";

const getUser = () => auth?.currentUser;

const getLocalKey = (uid) => `spendwise_expenses_${uid}`;

const normalizeExpense = (id, data) => ({
  id,
  amount: Number(data.amount || 0),
  category: data.category || "Food",
  createdAt:
    typeof data.createdAt?.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : data.createdAt || new Date().toISOString(),
});

const readLocal = (uid) => {
  try {
    const data = JSON.parse(localStorage.getItem(getLocalKey(uid)) || "[]");
    return Array.isArray(data)
      ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
  } catch {
    return [];
  }
};

const writeLocal = (uid, expenses) => {
  localStorage.setItem(getLocalKey(uid), JSON.stringify(expenses));
};

const getExpensesCollection = (uid) => collection(db, "users", uid, "expenses");

const withTimeout = (promise, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), 5000);
    }),
  ]);

export const ExpenseService = {
  getAll: async () => {
    const user = getUser();
    if (!user) return [];

    if (!isFirebaseConfigured || !db) {
      return readLocal(user.uid);
    }

    try {
      const snapshot = await withTimeout(getDocs(
        query(getExpensesCollection(user.uid), orderBy("createdAt", "desc")),
      ), "Firestore load timed out");
      return snapshot.docs.map((item) => normalizeExpense(item.id, item.data()));
    } catch (error) {
      console.warn("Using local expense storage because Firestore is unavailable.", error);
      return readLocal(user.uid);
    }
  },

  create: async (data) => {
    const user = getUser();
    if (!user) throw new Error("Login required");

    const expense = normalizeExpense(String(Date.now()), {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
    });

    if (isFirebaseConfigured && db) {
      try {
        const created = await withTimeout(
          addDoc(getExpensesCollection(user.uid), {
            amount: expense.amount,
            category: expense.category,
            createdAt: expense.createdAt,
          }),
          "Firestore save timed out",
        );
        return { ...expense, id: created.id };
      } catch (error) {
        console.warn("Saving expense locally because Firestore is unavailable.", error);
      }
    }

    const expenses = [expense, ...readLocal(user.uid)];
    writeLocal(user.uid, expenses);
    return expense;
  },

  update: async (id, data) => {
    const user = getUser();
    if (!user) throw new Error("Login required");

    const updates = {
      amount: Number(data.amount || 0),
      category: data.category || "Food",
    };

    if (isFirebaseConfigured && db) {
      try {
        await withTimeout(
          updateDoc(doc(db, "users", user.uid, "expenses", id), updates),
          "Firestore update timed out",
        );
        const current = await ExpenseService.getAll();
        return current.find((expense) => expense.id === id) || { id, ...updates };
      } catch (error) {
        console.warn("Updating local expense because Firestore is unavailable.", error);
      }
    }

    const expenses = readLocal(user.uid).map((expense) =>
      expense.id === id ? { ...expense, ...updates } : expense,
    );
    writeLocal(user.uid, expenses);
    return expenses.find((expense) => expense.id === id) || { id, ...updates };
  },

  remove: async (id) => {
    const user = getUser();
    if (!user) throw new Error("Login required");

    if (isFirebaseConfigured && db) {
      try {
        await withTimeout(
          deleteDoc(doc(db, "users", user.uid, "expenses", id)),
          "Firestore delete timed out",
        );
        return;
      } catch (error) {
        console.warn("Deleting local expense because Firestore is unavailable.", error);
      }
    }

    writeLocal(
      user.uid,
      readLocal(user.uid).filter((expense) => expense.id !== id),
    );
  },
};

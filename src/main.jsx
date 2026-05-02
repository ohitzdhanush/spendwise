<<<<<<< HEAD
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ExpenseProvider } from "./context/ExpenseContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879
    <AuthProvider>
      <ExpenseProvider>
        <App />
      </ExpenseProvider>
    </AuthProvider>
<<<<<<< HEAD
  </BrowserRouter>
);
=======
  </React.StrictMode>
);
>>>>>>> b572b5d293c95c88857c71d6bd80a58e68778879

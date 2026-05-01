import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar dark={dark} setDark={setDark} />

          <main className="p-6 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
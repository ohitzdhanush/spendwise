import { FaMoon, FaSun } from "react-icons/fa";

export default function Navbar({ dark, setDark }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            SpendWise
          </p>
          <h1 className="text-lg font-extrabold text-slate-950 dark:text-white sm:text-xl">
            Smart expense dashboard
          </h1>
        </div>

        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={() => setDark(!dark)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
}

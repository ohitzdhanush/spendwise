export default function Navbar({ dark, setDark }) {
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-4 flex justify-between items-center border-b">
      <h1 className="font-semibold text-lg">Spendwise</h1>

      <button
        onClick={() => setDark(!dark)}
        className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
      >
        🌙
      </button>
    </header>
  );
}
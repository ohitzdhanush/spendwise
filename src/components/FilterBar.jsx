import { useExpense } from "../context/ExpenseContext";

export default function FilterBar() {
  const { filters, setFilters } = useExpense();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      
      <input
        type="text"
        placeholder="Search"
        className="p-2 border rounded-lg"
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      <select
        className="p-2 border rounded-lg"
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value })
        }
      >
        <option>All</option>
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
      </select>

      <input
        type="number"
        placeholder="Min"
        className="p-2 border rounded-lg"
        onChange={(e) =>
          setFilters({ ...filters, min: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Max"
        className="p-2 border rounded-lg"
        onChange={(e) =>
          setFilters({ ...filters, max: e.target.value })
        }
      />
    </div>
  );
}
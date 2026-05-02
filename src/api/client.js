const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://spendwise-eds9.onrender.com";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
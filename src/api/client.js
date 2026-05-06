const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://spendwise-eds9.onrender.com";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `API Error: ${res.status}`;
    try {
      const errorBody = await res.json();
      message = errorBody.message || message;
    } catch {
      // Keep the status-based message when the API returns no JSON body.
    }

    throw new Error(message);
  }

  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

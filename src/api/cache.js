// Persistent cache using localStorage + in-memory fallback

const PREFIX = "spendwise_cache_";

function getKey(key) {
  return PREFIX + key;
}

export function setCache(key, data, ttlMs = 60000) {
  const payload = {
    data,
    expiry: Date.now() + ttlMs,
  };

  localStorage.setItem(getKey(key), JSON.stringify(payload));
}

export function getCache(key) {
  const raw = localStorage.getItem(getKey(key));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(getKey(key));
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

// Return even if expired (for instant UI)
export function peekCache(key) {
  const raw = localStorage.getItem(getKey(key));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed.data;
  } catch {
    return null;
  }
}

export function invalidateCache(key) {
  localStorage.removeItem(getKey(key));
}

export function clearCache() {
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(PREFIX)) {
      localStorage.removeItem(k);
    }
  });
}
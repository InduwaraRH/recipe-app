// Use environment variable for production, fallback to development proxy
const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipes` : '/api/recipes';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${txt}`.trim());
  }
  return res.json();
}

export async function getCategories({ token, withCredentials = false } = {}) {
  const res = await fetch(`${BASE}/categories`, {
    headers: { ...authHeaders(token) },
    credentials: withCredentials ? 'include' : 'same-origin',
  });
  return handle(res); 
}

export async function listByCategory(category, { token, withCredentials = false } = {}) {
  const url = new URL(`${BASE}`, window.location.origin);
  url.searchParams.set('category', category);
  const res = await fetch(url.toString().replace(window.location.origin, ''), {
    headers: { ...authHeaders(token) },
    credentials: withCredentials ? 'include' : 'same-origin',
  });
  return handle(res); 
}

export async function getById(id, { token, withCredentials = false } = {}) {
  const res = await fetch(`${BASE}/${id}`, {
    headers: { ...authHeaders(token) },
    credentials: withCredentials ? 'include' : 'same-origin',
  });
  const payload = await handle(res);
 
  const meal = Array.isArray(payload?.meals) ? payload.meals[0] : payload;
  return meal ?? null;
}

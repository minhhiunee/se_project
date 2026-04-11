/**
 * In development, use relative `/api` so Create React App proxies to the backend
 * (see "proxy" in package.json). That avoids cross-origin "Failed to fetch" issues.
 * For production behind a separate API host, set REACT_APP_API_URL, e.g.
 * REACT_APP_API_URL=https://api.example.com/api
 */
const BASE_URL = process.env.REACT_APP_API_URL || "/api";

function getStoredToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const { auth = false, ...fetchOptions } = options;

  const headers = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {})
  };

  if (auth) {
    const t = getStoredToken();
    if (t) {
      headers.Authorization = `Bearer ${t}`;
    }
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers
    });
  } catch (err) {
    const message =
      err?.message === "Failed to fetch"
        ? "Cannot reach the server. Start the backend (npm start in se_project/backend) and open the app at http://localhost:3000 — not as a file."
        : err?.message || "Network error";
    const wrapped = new Error(message);
    wrapped.cause = err;
    throw wrapped;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    const message =
      (typeof data.message === "string" && data.message) ||
      `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}

export function getProducts() {
  return request("/products");
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCart() {
  return request("/cart", { auth: true });
}

export function addToCart(payload) {
  return request("/cart", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true
  });
}

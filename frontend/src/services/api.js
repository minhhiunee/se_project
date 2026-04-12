import axios from "axios";

/**
 * In development, use relative `/api` so Create React App proxies to the backend
 * (see "proxy" in package.json). Set REACT_APP_API_URL for a custom API base.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* ignore */
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      const message =
        error.message === "Network Error"
          ? "Cannot reach the server. Start the backend and open the app at http://localhost:3000."
          : error.message || "Network error";
      const wrapped = new Error(message);
      wrapped.cause = error;
      return Promise.reject(wrapped);
    }
    const data = error.response.data;
    const message =
      (typeof data?.message === "string" && data.message) ||
      `Request failed (${error.response.status})`;
    const err = new Error(message);
    err.status = error.response.status;
    return Promise.reject(err);
  }
);

export function getProducts() {
  return apiClient.get("/products");
}

export function getProductsSortedByPrice(order) {
  return apiClient.get("/products/sort/price", {
    params: { order }
  });
}

export function filterProducts(min, max) {
  return apiClient.get("/products/filter", {
    params: { min, max }
  });
}

export function getProductById(id) {
  return apiClient.get(`/products/${id}`);
}

export function searchProducts(q) {
  return apiClient.get("/products/search", {
    params: { q }
  });
}

export function getProductReviews(productId) {
  return apiClient.get(`/reviews/${productId}`);
}

export function createReview(body) {
  return apiClient.post("/reviews", body);
}

export function checkoutOrder() {
  return apiClient.post("/orders/checkout");
}

export function getMyOrders() {
  return apiClient.get("/orders/my");
}

export function login(payload) {
  return apiClient.post("/auth/login", payload);
}

export function register(payload) {
  return apiClient.post("/auth/register", payload);
}

export function getCart() {
  return apiClient.get("/cart");
}

export function addToCart(payload) {
  return apiClient.post("/cart/add", payload);
}

export function removeCartItem(cartItemId) {
  return apiClient.delete(`/cart/remove/${cartItemId}`);
}

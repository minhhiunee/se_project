import React, { useCallback, useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import {
  getProducts,
  getProductsSortedByPrice
} from "../services/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDefault = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDefault();
  }, [loadDefault]);

  async function sortByPrice(order) {
    setLoading(true);
    setError("");
    try {
      const data = await getProductsSortedByPrice(order);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to sort products.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="products-page">
      <h1>Products</h1>

      <div className="sort-toolbar">
        <button
          type="button"
          className="btn-sort"
          onClick={() => sortByPrice("asc")}
          disabled={loading}
        >
          Sort Price ↑
        </button>
        <button
          type="button"
          className="btn-sort"
          onClick={() => sortByPrice("desc")}
          disabled={loading}
        >
          Sort Price ↓
        </button>
      </div>

      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}

      <ProductList products={products} loading={loading} />
    </section>
  );
}

export default ProductsPage;

import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import PriceFilter from "../components/PriceFilter";
import {
  getProducts,
  getProductsSortedByPrice,
  searchProducts,
  filterProducts
} from "../services/api";

function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const loadDefault = useCallback(async () => {
    setLoading(true);
    setError("");
    setSearchActive(false);
    setFilterActive(false);
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
    const pending =
      typeof location.state?.q === "string" ? location.state.q.trim() : "";
    if (pending) return;
    loadDefault();
  }, [loadDefault]);

  useEffect(() => {
    const keyword =
      typeof location.state?.q === "string" ? location.state.q.trim() : "";
    if (!keyword) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      setSearchActive(true);
      setFilterActive(false);
      try {
        const data = await searchProducts(keyword);
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
        if (!cancelled) {
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Search failed.");
          setProducts([]);
          navigate(location.pathname, { replace: true, state: {} });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.state, location.pathname, navigate]);

  async function sortByPrice(order) {
    setLoading(true);
    setError("");
    setSearchActive(false);
    setFilterActive(false);
    try {
      const data = await getProductsSortedByPrice(order);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to sort products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(keyword) {
    setError("");
    if (!keyword) {
      await loadDefault();
      return;
    }
    setLoading(true);
    setSearchActive(true);
    setFilterActive(false);
    try {
      const data = await searchProducts(keyword);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Search failed.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePriceFilter(min, max) {
    setLoading(true);
    setError("");
    setSearchActive(false);
    setFilterActive(true);
    try {
      const data = await filterProducts(min, max);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Filter failed.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="products-page page-section">
      <header className="page-section__header">
        <h1 className="page-section__title">All products</h1>
        <p className="page-section__lead muted">
          Search by name, filter by budget, or sort by price.
        </p>
      </header>

      <SearchBar onSearch={handleSearch} disabled={loading} />

      <div className="products-page__tools">
        <PriceFilter onApply={handlePriceFilter} disabled={loading} />
        <div className="sort-toolbar card card--soft">
          <span className="sort-toolbar__label">Sort by price</span>
          <div className="sort-toolbar__btns">
            <button
              type="button"
              className="btn-sort"
              onClick={() => sortByPrice("asc")}
              disabled={loading}
            >
              Low → High
            </button>
            <button
              type="button"
              className="btn-sort"
              onClick={() => sortByPrice("desc")}
              disabled={loading}
            >
              High → Low
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}

      <ProductList
        products={products}
        loading={loading}
        emptyMessage={
          searchActive
            ? "No products match your search."
            : filterActive
              ? "No products in this price range."
              : "No products yet."
        }
      />
    </section>
  );
}

export default ProductsPage;

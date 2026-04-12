import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/api";

function HomePage() {
  const { isAuthenticated, ready } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) {
          setFeatured(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch {
        if (!cancelled) setFeatured([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">Spring collection</p>
          <h1 className="hero__title">Bright deals on everyday tech</h1>
          <p className="hero__text">
            Curated accessories with clear pricing, fast checkout, and honest
            reviews from shoppers like you.
          </p>
          <div className="hero__cta">
            <Link to="/products" className="btn btn-primary hero__btn">
              Shop now
            </Link>
            {ready && !isAuthenticated ? (
              <Link
                to="/register"
                className="btn btn-secondary hero__btn-secondary"
              >
                Create an account
              </Link>
            ) : null}
          </div>
        </div>
        <div className="hero__art" aria-hidden>
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
        </div>
      </section>

      <section className="featured-section page-section">
        <div className="section-head">
          <h2 className="section-title">Featured products</h2>
          <Link to="/products" className="section-link">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="muted">Loading picks…</p>
        ) : featured.length ? (
          <div className="grid product-grid product-grid--home">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="muted">
            No products yet.{" "}
            <Link to="/products">Browse the catalog</Link> when items are
            available.
          </p>
        )}
      </section>
    </div>
  );
}

export default HomePage;

import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart, getProductById, getProductReviews } from "../services/api";
import StarRating from "../components/StarRating";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#e8eef5" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="16">No image</text></svg>'
  );

function ProductDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);

  const loadReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const data = await getProductReviews(id);
      setAverageRating(data?.averageRating ?? null);
      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
    } catch {
      setAverageRating(null);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setCartMessage("");
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message || "Failed to load product.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  async function handleAddToCart() {
    if (!product) return;
    if (!isAuthenticated) {
      setCartMessage("Sign in to add items to your cart.");
      return;
    }
    setCartMessage("");
    setAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setCartMessage("Added to cart.");
    } catch (err) {
      setCartMessage(err.message || "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <section className="product-detail-page page-section">
        <p className="muted">Loading product…</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="product-detail-page page-section">
        <p className="error-text" role="alert">
          {error || "Product not found."}
        </p>
        <p>
          <Link to="/products">← Back to products</Link>
        </p>
      </section>
    );
  }

  const imgSrc = product.imageUrl || PLACEHOLDER_IMG;
  const displayAvg = averageRating ?? product.averageRating ?? null;

  return (
    <section className="product-detail-page page-section">
      <p className="product-detail__back">
        <Link to="/products">← All products</Link>
      </p>

      <div className="product-detail card card--elevated">
        <div className="product-detail__media">
          <img
            className="product-detail__image"
            src={imgSrc}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="product-detail__body">
          <h1 className="product-detail__title">{product.name}</h1>
          <div className="product-detail__rating-block">
            <StarRating value={displayAvg ?? 0} readOnly />
            {displayAvg != null ? (
              <span className="product-detail__avg">
                {displayAvg.toFixed(1)} / 5
              </span>
            ) : (
              <span className="muted product-detail__avg">No ratings yet</span>
            )}
          </div>
          <p className="product-detail__price">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="product-detail__description">
            {product.description?.trim()
              ? product.description
              : "No description available."}
          </p>
          {product.createdAt ? (
            <p className="muted product-detail__meta">
              Listed {new Date(product.createdAt).toLocaleDateString()}
            </p>
          ) : null}

          <div className="product-detail__actions">
            <button
              type="button"
              className="btn btn-primary btn-inline"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adding…" : "Add to cart"}
            </button>
            {cartMessage ? (
              <p className="product-detail__hint" role="status">
                {cartMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="product-detail__reviews">
        <h2 className="section-title">Customer reviews</h2>
        <ReviewForm productId={product.id} onSubmitted={loadReviews} />
        <ReviewList
          reviews={reviews}
          loading={reviewsLoading}
          emptyText="Be the first to review this product."
        />
      </div>
    </section>
  );
}

export default ProductDetailPage;

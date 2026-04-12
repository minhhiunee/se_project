import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../services/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#e5e7eb" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="16">No image</text></svg>'
  );

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const imgSrc = product.imageUrl || PLACEHOLDER_IMG;

  async function handleAddToCart() {
    if (!isAuthenticated) {
      setMessage("Sign in to add items to your cart.");
      return;
    }
    setMessage("");
    setAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setMessage("Added to cart.");
    } catch (err) {
      setMessage(err.message || "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="product-card card">
      <Link to={`/products/${product.id}`} className="product-card__image-link">
        <img
          className="product-card__image"
          src={imgSrc}
          alt=""
          loading="lazy"
        />
      </Link>
      <div className="product-card__body">
        <h3 className="product-card__title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">
          ${Number(product.price).toFixed(2)}
        </p>
        <div className="product-card__actions">
          <button
            type="button"
            className="btn btn-primary btn-inline"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Adding…" : "Add to cart"}
          </button>
          {message ? (
            <p className="product-card__hint" role="status">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

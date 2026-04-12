import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useAuth } from "../context/AuthContext";
import { getCart, removeCartItem } from "../services/api";

function CartPage() {
  const { isAuthenticated, ready } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getCart();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load cart.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!ready) return;
    loadCart();
  }, [ready, loadCart]);

  async function handleRemove(cartItemId) {
    setError("");
    try {
      const data = await removeCartItem(cartItemId);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not remove item.");
    }
  }

  const grandTotal = items.reduce(
    (sum, row) => sum + (row.lineTotal ?? row.price * row.quantity),
    0
  );

  if (!ready || loading) {
    return (
      <section className="cart-page">
        <h1>Cart</h1>
        <p className="muted">Loading…</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="cart-page">
        <h1>Cart</h1>
        <p>
          <Link to="/login">Sign in</Link> to view your cart.
        </p>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h1>Cart</h1>

      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                showRemove
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <p className="cart-total">
            <strong>Total:</strong> ${grandTotal.toFixed(2)}
          </p>
          <p className="cart-checkout-cta">
            <Link to="/checkout" className="btn btn-primary btn-inline">
              Proceed to checkout
            </Link>
          </p>
        </>
      )}
    </section>
  );
}

export default CartPage;

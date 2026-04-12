import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useAuth } from "../context/AuthContext";
import { checkoutOrder, getCart } from "../services/api";

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, ready } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
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

  async function handlePlaceOrder() {
    setError("");
    setPlacing(true);
    try {
      await checkoutOrder();
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(err.message || "Checkout failed.");
    } finally {
      setPlacing(false);
    }
  }

  if (!ready || loading) {
    return (
      <section className="checkout-page">
        <h1>Checkout</h1>
        <p className="muted">Loading…</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="checkout-page">
        <h1>Checkout</h1>
        <p>
          <Link to="/login">Sign in</Link> to place an order.
        </p>
      </section>
    );
  }

  const grandTotal = items.reduce(
    (sum, row) => sum + (row.lineTotal ?? row.price * row.quantity),
    0
  );

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="muted">
          Your cart is empty.{" "}
          <Link to="/products">Browse products</Link>
        </p>
      ) : (
        <>
          <h2 className="checkout-page__subhead">Order summary</h2>
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} showRemove={false} />
            ))}
          </ul>
          <p className="cart-total checkout-page__total">
            <strong>Total:</strong> ${grandTotal.toFixed(2)}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-inline checkout-page__submit"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? "Placing order…" : "Place Order"}
          </button>
          <p className="muted checkout-page__note">
            <Link to="/cart">← Back to cart</Link>
          </p>
        </>
      )}
    </section>
  );
}

export default CheckoutPage;

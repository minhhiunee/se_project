import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/api";

function OrdersPage() {
  const { isAuthenticated, ready } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!ready) return;
    load();
  }, [ready, load]);

  if (!ready || loading) {
    return (
      <section className="orders-page">
        <h1>Order history</h1>
        <p className="muted">Loading…</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="orders-page">
        <h1>Order history</h1>
        <p>
          <Link to="/login">Sign in</Link> to view your orders.
        </p>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <h1>Order history</h1>

      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <p className="muted">
          You have no orders yet.{" "}
          <Link to="/products">Shop products</Link>
        </p>
      ) : (
        <div className="orders-page__list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;

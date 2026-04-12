import React from "react";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString();
  } catch {
    return String(iso);
  }
}

function OrderCard({ order }) {
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <article className="order-card card">
      <div className="order-card__summary">
        <div className="order-card__row">
          <span className="order-card__label">Order ID</span>
          <span className="order-card__value">#{order.id}</span>
        </div>
        <div className="order-card__row">
          <span className="order-card__label">Date</span>
          <span className="order-card__value">{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-card__row">
          <span className="order-card__label">Status</span>
          <span className="order-card__value order-card__status">
            {order.status || "—"}
          </span>
        </div>
        <div className="order-card__row order-card__row--total">
          <span className="order-card__label">Total</span>
          <span className="order-card__value">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>

      <details className="order-card__details">
        <summary className="order-card__toggle">Line items</summary>
        {items.length === 0 ? (
          <p className="muted order-card__empty">No line items.</p>
        ) : (
          <ul className="order-card__items">
            {items.map((line) => (
              <li key={line.id} className="order-card__item">
                <span className="order-card__item-name">
                  {line.product?.name ?? `Product #${line.productId}`}
                </span>
                <span className="order-card__item-meta">
                  ${Number(line.price).toFixed(2)} × {line.quantity} = $
                  {(Number(line.price) * Number(line.quantity)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </details>
    </article>
  );
}

export default OrderCard;

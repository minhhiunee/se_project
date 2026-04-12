import React from "react";

function CartItem({ item, onRemove, showRemove }) {
  const line =
    item.lineTotal ?? Number(item.price) * Number(item.quantity);

  return (
    <li className="cart-row card">
      <div className="cart-row__main">
        <span className="cart-row__name">{item.name}</span>
        <span className="cart-row__meta">
          ${Number(item.price).toFixed(2)} × {item.quantity}
        </span>
      </div>
      <div className="cart-row__side">
        <span className="cart-row__line">${Number(line).toFixed(2)}</span>
        {showRemove && onRemove ? (
          <button
            type="button"
            className="btn-remove"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        ) : null}
      </div>
    </li>
  );
}

export default CartItem;

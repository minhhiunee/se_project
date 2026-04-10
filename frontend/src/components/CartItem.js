import React from "react";

function CartItem({ item }) {
  return (
    <article className="card">
      <h4>{item.name || "Cart item"}</h4>
      <p>Quantity: {item.quantity ?? 1}</p>
      <p>Price: ${item.price ?? "N/A"}</p>
    </article>
  );
}

export default CartItem;

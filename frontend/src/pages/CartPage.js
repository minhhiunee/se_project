import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { getCart } from "../services/api";

function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart();
        const normalizedItems = Array.isArray(data) ? data : data.items || [];
        setItems(normalizedItems);
      } catch (error) {
        setItems([
          { id: 1, name: "Sample Cart Item", quantity: 1, price: 29.99 }
        ]);
      }
    }

    loadCart();
  }, []);

  return (
    <section>
      <h1>Cart Page</h1>
      {items.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <CartItem key={item.id || item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CartPage;

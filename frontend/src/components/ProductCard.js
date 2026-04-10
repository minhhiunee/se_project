import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="card">
      <h3>{product.name || "Unnamed product"}</h3>
      <p>Price: ${product.price ?? "N/A"}</p>
      <Link to={`/products/${product.id || product._id}`}>View details</Link>
    </article>
  );
}

export default ProductCard;

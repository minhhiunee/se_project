import React from "react";
import ProductCard from "./ProductCard";

function ProductList({ products, loading, emptyMessage }) {
  if (loading) {
    return <p className="muted">Loading products…</p>;
  }

  if (!products.length) {
    return <p className="muted">{emptyMessage || "No products yet."}</p>;
  }

  return (
    <div className="grid product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;

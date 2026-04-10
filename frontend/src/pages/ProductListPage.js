import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        const normalizedData = Array.isArray(data) ? data : data.products || [];
        setProducts(normalizedData);
      } catch (err) {
        setError("Failed to load products. Showing placeholder data.");
        setProducts([
          { id: 1, name: "Sample Product A", price: 29.99 },
          { id: 2, name: "Sample Product B", price: 49.99 }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section>
      <h1>Product List Page</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="error-text">{error}</p>}
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductListPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/api";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data.product || data);
      } catch (error) {
        setProduct({ id, name: "Sample Product", price: 19.99, description: "Placeholder product detail." });
      }
    }

    loadProduct();
  }, [id]);

  return (
    <section>
      <h1>Product Detail Page</h1>
      {!product ? (
        <p>Loading product details...</p>
      ) : (
        <div className="card">
          <h2>{product.name}</h2>
          <p>Price: ${product.price ?? "N/A"}</p>
          <p>{product.description || "No description available."}</p>
        </div>
      )}
    </section>
  );
}

export default ProductDetailPage;

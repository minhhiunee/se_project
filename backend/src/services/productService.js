const mockProducts = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 }
];

exports.getProducts = async () => {
  return mockProducts;
};

exports.getProductById = async (id) => {
  const numericId = Number(id);
  return mockProducts.find((product) => product.id === numericId) || null;
};

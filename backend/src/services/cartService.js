let mockCart = {
  userId: 1,
  items: [
    { productId: 1, name: "Product A", price: 100, quantity: 1 }
  ]
};

exports.getCart = async () => {
  return mockCart;
};

exports.addToCart = async (payload) => {
  const { productId, name, price, quantity } = payload || {};

  mockCart.items.push({
    productId: Number(productId) || 0,
    name: name || "Unknown Product",
    price: Number(price) || 0,
    quantity: Number(quantity) || 1
  });

  return mockCart;
};

exports.removeFromCart = async (productId) => {
  const numericId = Number(productId);
  mockCart.items = mockCart.items.filter((item) => item.productId !== numericId);
  return mockCart;
};

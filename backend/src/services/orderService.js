const mockOrders = [
  {
    id: 1,
    userId: 1,
    items: [{ productId: 1, name: "Product A", price: 100, quantity: 1 }],
    total: 100,
    status: "created"
  }
];

exports.getOrders = async () => {
  return mockOrders;
};

exports.createOrder = async (payload) => {
  const nextOrder = {
    id: mockOrders.length + 1,
    userId: 1,
    items: payload?.items || [],
    total: Number(payload?.total) || 0,
    status: "created"
  };

  mockOrders.push(nextOrder);
  return nextOrder;
};

const prisma = require("../prisma/prismaClient");

exports.getCartForUser = async (userId) => {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true
        }
      }
    },
    orderBy: { id: "asc" }
  });

  return items.map((row) => ({
    id: row.id,
    productId: row.productId,
    quantity: row.quantity,
    name: row.product.name,
    price: row.product.price,
    imageUrl: row.product.imageUrl,
    lineTotal: row.product.price * row.quantity
  }));
};

exports.addItem = async (userId, body) => {
  const productId = Number(body?.productId);
  const quantity = Number(body?.quantity ?? 1);

  if (!Number.isFinite(productId) || productId < 1) {
    const err = new Error("productId is required");
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    const err = new Error("quantity must be at least 1");
    err.statusCode = 400;
    throw err;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId, productId }
    },
    create: {
      userId,
      productId,
      quantity
    },
    update: {
      quantity: { increment: quantity }
    }
  });

  return exports.getCartForUser(userId);
};

exports.removeItem = async (userId, cartItemId) => {
  const id = Number(cartItemId);
  if (!Number.isFinite(id) || id < 1) {
    const err = new Error("Invalid cart item id");
    err.statusCode = 400;
    throw err;
  }

  const result = await prisma.cartItem.deleteMany({
    where: { id, userId }
  });

  if (result.count === 0) {
    const err = new Error("Cart item not found");
    err.statusCode = 404;
    throw err;
  }

  return exports.getCartForUser(userId);
};

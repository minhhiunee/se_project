const prisma = require("../prisma/prismaClient");

exports.checkoutFromCart = async (userId) => {
  return prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      },
      orderBy: { id: "asc" }
    });

    if (cartItems.length === 0) {
      const err = new Error("Cart is empty");
      err.statusCode = 400;
      throw err;
    }

    const total = cartItems.reduce(
      (sum, row) => sum + row.product.price * row.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "pending",
        items: {
          create: cartItems.map((row) => ({
            productId: row.productId,
            quantity: row.quantity,
            price: row.product.price
          }))
        }
      }
    });

    await tx.cartItem.deleteMany({ where: { userId } });

    return {
      orderId: order.id,
      total: order.total,
      status: order.status
    };
  });
};

exports.getOrdersForUser = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

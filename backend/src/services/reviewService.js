const prisma = require("../prisma/prismaClient");

function roundRating(value) {
  return Math.round(value * 10) / 10;
}

exports.createReview = async (userId, body) => {
  const productId = Number(body?.productId);
  const rating = Number(body?.rating);
  const comment =
    body?.comment == null || String(body.comment).trim() === ""
      ? null
      : String(body.comment).trim();

  if (!Number.isFinite(productId) || productId < 1) {
    const err = new Error("Valid productId is required");
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const err = new Error("Rating must be an integer from 1 to 5");
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

  const row = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment
    },
    select: {
      id: true,
      userId: true,
      productId: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: { id: true, name: true }
      }
    }
  });

  return row;
};

exports.listReviewsForProduct = async (productIdParam) => {
  const productId = Number(productIdParam);
  if (!Number.isFinite(productId) || productId < 1) {
    const err = new Error("Invalid product id");
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

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      productId: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: { id: true, name: true }
      }
    }
  });

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating =
    reviews.length > 0 ? roundRating(sum / reviews.length) : null;

  return { averageRating, reviews };
};

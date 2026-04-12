const prisma = require("../prisma/prismaClient");

const productSelectWithRatings = {
  id: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  createdAt: true,
  reviews: {
    select: { rating: true }
  }
};

const slimSelectWithRatings = {
  id: true,
  name: true,
  price: true,
  imageUrl: true,
  reviews: {
    select: { rating: true }
  }
};

function averageFromReviews(reviews) {
  const ratings = reviews?.map((r) => r.rating) ?? [];
  if (!ratings.length) {
    return { averageRating: null, reviewCount: 0 };
  }
  const sum = ratings.reduce((a, b) => a + b, 0);
  return {
    averageRating: Math.round((sum / ratings.length) * 10) / 10,
    reviewCount: ratings.length
  };
}

function mapProduct(row) {
  if (!row) return null;
  const { reviews, ...rest } = row;
  const { averageRating, reviewCount } = averageFromReviews(reviews);
  return {
    ...rest,
    averageRating,
    reviewCount
  };
}

function mapSlimProduct(row) {
  if (!row) return null;
  const { reviews, ...rest } = row;
  const { averageRating, reviewCount } = averageFromReviews(reviews);
  return {
    id: rest.id,
    name: rest.name,
    price: rest.price,
    imageUrl: rest.imageUrl,
    averageRating,
    reviewCount
  };
}

exports.listProducts = async () => {
  const rows = await prisma.product.findMany({
    orderBy: { id: "asc" },
    select: productSelectWithRatings
  });
  return rows.map(mapProduct);
};

exports.listProductsByPrice = async (order) => {
  const dir = order === "desc" ? "desc" : "asc";
  const rows = await prisma.product.findMany({
    orderBy: { price: dir },
    select: productSelectWithRatings
  });
  return rows.map(mapProduct);
};

exports.getProductById = async (id) => {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return null;
  }
  const row = await prisma.product.findUnique({
    where: { id: numericId },
    select: productSelectWithRatings
  });
  return mapProduct(row);
};

/**
 * Name search. MySQL collation utf8mb4_unicode_ci makes `contains` effectively
 * case-insensitive (Prisma MySQL does not support mode: "insensitive").
 */
exports.searchProductsByName = async (keyword) => {
  const k = String(keyword || "").trim();
  if (!k) {
    return [];
  }
  const rows = await prisma.product.findMany({
    where: {
      name: {
        contains: k
      }
    },
    orderBy: { id: "asc" },
    select: slimSelectWithRatings
  });
  return rows.map(mapSlimProduct);
};

exports.filterProductsByPrice = async (min, max) => {
  const gte = Number(min);
  const lte = Number(max);
  if (!Number.isFinite(gte) || !Number.isFinite(lte)) {
    const err = new Error('Query parameters "min" and "max" must be numbers');
    err.statusCode = 400;
    throw err;
  }
  if (gte < 0 || lte < 0 || gte > lte) {
    const err = new Error(
      "Invalid range: min and max must be non-negative and min must be <= max"
    );
    err.statusCode = 400;
    throw err;
  }
  const rows = await prisma.product.findMany({
    where: {
      price: {
        gte,
        lte
      }
    },
    orderBy: { price: "asc" },
    select: slimSelectWithRatings
  });
  return rows.map(mapSlimProduct);
};

exports.createProduct = async (body) => {
  const name = String(body?.name || "").trim();
  const price = Number(body?.price);
  const description =
    body?.description == null || body?.description === ""
      ? null
      : String(body.description);
  const imageUrl =
    body?.imageUrl == null || body?.imageUrl === ""
      ? null
      : String(body.imageUrl);

  if (!name) {
    const err = new Error("Name is required");
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isFinite(price) || price < 0) {
    const err = new Error("Price must be a non-negative number");
    err.statusCode = 400;
    throw err;
  }

  const row = await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl
    },
    select: productSelectWithRatings
  });
  return mapProduct(row);
};

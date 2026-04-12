const prisma = require("../prisma/prismaClient");

const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true
};

function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    imageUrl: row.imageUrl
  };
}

exports.listProducts = async () => {
  const rows = await prisma.product.findMany({
    orderBy: { id: "asc" },
    select: productSelect
  });
  return rows.map(mapProduct);
};

exports.listProductsByPrice = async (order) => {
  const dir = order === "desc" ? "desc" : "asc";
  const rows = await prisma.product.findMany({
    orderBy: { price: dir },
    select: productSelect
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
    select: productSelect
  });
  return mapProduct(row);
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
    select: productSelect
  });
  return mapProduct(row);
};

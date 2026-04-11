const prisma = require("../prisma/prismaClient");

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
};

exports.createUser = async (data) => {
  const { email, password, name } = data;

  try {
    return await prisma.user.create({
      data: { email, password, name },
      select: userPublicSelect,
    });
  } catch (error) {
    if (error.code === "P2002") {
      const err = new Error("Email already exists");
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
};

exports.getAllUsers = async () => {
  return prisma.user.findMany({
    select: userPublicSelect,
    orderBy: { id: "asc" },
  });
};

exports.getUserById = async (id) => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: numericId },
    select: userPublicSelect,
  });
};

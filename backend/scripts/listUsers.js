const { loadEnv } = require("../src/config/env");

loadEnv();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.user
  .findMany({ orderBy: { id: "asc" } })
  .then((users) => {
    console.log("User row count:", users.length);
    console.log(JSON.stringify(users, null, 2));
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

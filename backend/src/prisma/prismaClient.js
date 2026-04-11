const { loadEnv } = require("../config/env");

loadEnv();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;

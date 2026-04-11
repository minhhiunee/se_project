const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

/**
 * Requires: Authorization: Bearer <token>
 * Sets req.user to { id, email, name, createdAt } from the database.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      const err = new Error("Authentication required");
      err.statusCode = 401;
      return next(err);
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      const err = new Error("Authentication required");
      err.statusCode = 401;
      return next(err);
    }

    if (!process.env.JWT_SECRET) {
      const err = new Error("JWT_SECRET is not configured");
      err.statusCode = 500;
      return next(err);
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      const err = new Error("Invalid or expired token");
      err.statusCode = 401;
      return next(err);
    }

    const userId = payload.sub ?? payload.userId;
    if (userId == null) {
      const err = new Error("Invalid token payload");
      err.statusCode = 401;
      return next(err);
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      return next(err);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate
};

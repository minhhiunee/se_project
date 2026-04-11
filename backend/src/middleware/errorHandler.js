exports.notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Maps Prisma and other errors to HTTP status + a safe client message.
 * Prisma errors usually have no statusCode, which previously became 500 with vague UI text.
 */
exports.errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("[error]", err);
  }

  let statusCode =
    typeof err.statusCode === "number" ? err.statusCode : 500;
  let message =
    typeof err.message === "string" && err.message.trim()
      ? err.message
      : "Internal server error";

  if (err.name === "PrismaClientInitializationError") {
    statusCode = 503;
    message =
      "Cannot connect to the database. Ensure MySQL is running and DATABASE_URL in backend/.env is correct.";
  } else if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "A record with this value already exists.";
    } else if (
      err.code === "P1000" ||
      err.code === "P1001" ||
      err.code === "P1017"
    ) {
      statusCode = 503;
      message =
        "Cannot reach the database. Check MySQL is running, credentials in DATABASE_URL, and that the database exists.";
    }
  } else if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Invalid request data.";
  }

  if (message === "JWT_SECRET is not configured") {
    statusCode = 503;
  }

  res.status(statusCode).json({ message });
};

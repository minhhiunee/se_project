const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = "7d";

function assertEnv() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
}

function validateEmail(email) {
  const trimmed = String(email || "").trim();
  if (!trimmed) return { ok: false, message: "Email is required" };
  const basic =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (!basic) return { ok: false, message: "Invalid email format" };
  return { ok: true, value: trimmed };
}

function validateRegisterInput(body) {
  const name = String(body?.name || "").trim();
  const password = body?.password;
  const emailResult = validateEmail(body?.email);

  if (!name) {
    const err = new Error("Name is required");
    err.statusCode = 400;
    throw err;
  }
  if (!emailResult.ok) {
    const err = new Error(emailResult.message);
    err.statusCode = 400;
    throw err;
  }
  if (typeof password !== "string" || password.length < 8) {
    const err = new Error("Password must be at least 8 characters");
    err.statusCode = 400;
    throw err;
  }

  return { name, email: emailResult.value, password };
}

function validateLoginInput(body) {
  const password = body?.password;
  const emailResult = validateEmail(body?.email);

  if (!emailResult.ok) {
    const err = new Error(emailResult.message);
    err.statusCode = 400;
    throw err;
  }
  if (typeof password !== "string" || !password) {
    const err = new Error("Password is required");
    err.statusCode = 400;
    throw err;
  }

  return { email: emailResult.value, password };
}

async function register(body) {
  assertEnv();
  const { name, email, password } = validateRegisterInput(body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed
    },
    select: {
      id: true,
      email: true
    }
  });

  return {
    id: user.id,
    email: user.email
  };
}

async function login(body) {
  assertEnv();
  const { email, password } = validateLoginInput(body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  let match = false;
  try {
    match = await bcrypt.compare(password, user.password);
  } catch {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }
  if (!match) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}

module.exports = {
  register,
  login
};

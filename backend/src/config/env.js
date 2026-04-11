const path = require("path");
const dotenv = require("dotenv");

/** Absolute path to backend/.env (this file lives in backend/src/config). */
const ENV_PATH = path.join(__dirname, "..", "..", ".env");

/**
 * Load backend/.env so DATABASE_URL matches Prisma and MySQL Workbench,
 * even if the process was started with a different cwd or a stale system DATABASE_URL.
 */
function loadEnv() {
  dotenv.config({ path: ENV_PATH, override: true });
}

/**
 * Log which database host/name the app will use (password hidden).
 */
function logDatabaseTarget() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.warn("[env] DATABASE_URL is not set after loading", ENV_PATH);
    return;
  }
  try {
    const u = new URL(raw.replace(/^mysql:\/\//i, "http://"));
    const db = (u.pathname || "").replace(/^\//, "") || "(no database)";
    console.log(
      `[env] Database: ${u.hostname}:${u.port || "3306"} / ${db} (user: ${u.username || "?"})`
    );
  } catch {
    console.warn("[env] DATABASE_URL is set but could not be parsed for logging");
  }
}

module.exports = { loadEnv, logDatabaseTarget, ENV_PATH };

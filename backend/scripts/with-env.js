/**
 * Run a command with the same env as the API (backend/.env with override).
 * Example: node scripts/with-env.js npx prisma studio
 */
const { execSync } = require("child_process");
const { loadEnv } = require("../src/config/env");

loadEnv();

const cmd = process.argv.slice(2).join(" ");
if (!cmd.trim()) {
  console.error("Usage: node scripts/with-env.js <command>");
  process.exit(1);
}

execSync(cmd, { stdio: "inherit", env: process.env, shell: true });

import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "../db/database.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const schema = await readFile(join(root, "db", "schema.sql"), "utf8");

try {
  await pool.query(schema);
  console.log("PostgreSQL schema is ready.");
} finally {
  await pool.end();
}

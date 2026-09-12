import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "csv-parse/sync";
import { pool } from "../db/database.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const file = join(root, "ml", "data", "processed", "MPLADS_master_dataset_26102_cleaned.csv");
const rows = parse(await readFile(file, "utf8"), { columns: true, skip_empty_lines: true, bom: true });
const columns = [
  "project_id", "mp_name", "house", "state", "constituency", "district", "project_type",
  "recommendation_start_date", "snapshot_date", "sanctioned_amount_inr", "released_amount_inr",
  "expenditure_amount_inr", "physical_progress_pct", "delay_days", "completion_status",
  "description", "is_anomaly", "anomaly_type", "risk_score", "data_source",
];
const numeric = (value) => Number.parseFloat(value || "0");
const score = (row) => Math.min(100, Math.round(
  Math.min(Math.abs(numeric(row.progress_gap_pct)), 50) * 1.1 +
  Math.min(Math.abs(numeric(row.cost_deviation_pct)), 50) * 0.7 +
  Math.min(numeric(row.delay_days) / 30, 20) * 1.2 +
  Math.min(numeric(row.unspent_ratio) * 100, 30) * 0.5,
));
const valuesFor = (row) => columns.map((column) => {
  if (column === "is_anomaly") return String(row.is_anomaly).trim() === "1";
  if (column === "risk_score") return score(row);
  if (column === "data_source") return "synthetic_demo";
  if (["sanctioned_amount_inr", "released_amount_inr", "expenditure_amount_inr", "physical_progress_pct", "delay_days"].includes(column)) return numeric(row[column]);
  return row[column] || null;
});

try {
  for (let start = 0; start < rows.length; start += 200) {
    const batch = rows.slice(start, start + 200);
    const params = batch.flatMap(valuesFor);
    const placeholders = batch.map((_, rowIndex) => `(${columns.map((_, columnIndex) => `$${rowIndex * columns.length + columnIndex + 1}`).join(", ")})`).join(", ");
    await pool.query(
      `INSERT INTO works (${columns.join(", ")}) VALUES ${placeholders}
       ON CONFLICT (project_id) DO UPDATE SET
         mp_name = EXCLUDED.mp_name, state = EXCLUDED.state, district = EXCLUDED.district,
         sanctioned_amount_inr = EXCLUDED.sanctioned_amount_inr, released_amount_inr = EXCLUDED.released_amount_inr,
         expenditure_amount_inr = EXCLUDED.expenditure_amount_inr, physical_progress_pct = EXCLUDED.physical_progress_pct,
         delay_days = EXCLUDED.delay_days, completion_status = EXCLUDED.completion_status,
         is_anomaly = EXCLUDED.is_anomaly, anomaly_type = EXCLUDED.anomaly_type, risk_score = EXCLUDED.risk_score,
         data_source = EXCLUDED.data_source, imported_at = NOW()`,
      params,
    );
  }
  console.log(`Imported ${rows.length} records as clearly labelled synthetic demo data.`);
} finally {
  await pool.end();
}

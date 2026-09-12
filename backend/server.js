import "dotenv/config";
import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "csv-parse/sync";
import { pool, query } from "./db/database.js";

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

const backendRoot = dirname(fileURLToPath(import.meta.url));
const fallbackPath = join(backendRoot, "ml", "data", "processed", "MPLADS_master_dataset_26102_cleaned.csv");
let fallbackRows;
const number = (value) => Number.parseFloat(value || "0") || 0;
const score = (row) => Math.min(100, Math.round(
  Math.min(Math.abs(number(row.progress_gap_pct)), 50) * 1.1 +
  Math.min(Math.abs(number(row.cost_deviation_pct)), 50) * 0.7 +
  Math.min(number(row.delay_days) / 30, 20) * 1.2 +
  Math.min(number(row.unspent_ratio) * 100, 30) * 0.5,
));
const fallbackData = async () => {
  if (!fallbackRows) fallbackRows = parse(await readFile(fallbackPath, "utf8"), { columns: true, skip_empty_lines: true, bom: true });
  return fallbackRows;
};
const rowStatus = (row) => {
  if ((row.completion_status || "").toLowerCase() === "completed" || number(row.physical_progress_pct) >= 100) return "Completed";
  if ((row.completion_status || "").toLowerCase().includes("stall")) return "Stalled";
  return number(row.delay_days) > 0 ? "Delayed" : "Ongoing";
};
const fallbackUiData = async () => {
  const rows = await fallbackData();
  const rowsById = new Map(rows.map((row) => [row.project_id, row]));
  const works = rows.map((row) => ({
    id: row.project_id, name: row.description || row.project_id, sector: row.project_type || "Unclassified",
    mp: row.mp_name || "Not recorded", constituency: row.constituency || "Not recorded", state: row.state || "Not recorded",
    district: row.district || "Not recorded", agency: "District implementing agency", cost: Math.round(number(row.sanctioned_amount_inr) / 1000) / 100,
    disbursed: Math.round(number(row.released_amount_inr) / 1000) / 100, progressPct: Math.round(number(row.physical_progress_pct)),
    status: rowStatus(row), riskScore: score(row), flagType: row.anomaly_type || "None", sanctionDate: row.recommendation_start_date || "Not recorded", geoCoords: "Not recorded",
  }));
  const alerts = works.filter((work, index) => work.riskScore >= 60 || String(rows[index].is_anomaly).trim() === "1").sort((a, b) => b.riskScore - a.riskScore).slice(0, 600).map((work) => ({
    id: work.id, work: work.name, mp: work.mp, state: work.state, type: work.flagType, risk: work.riskScore,
    amount: `₹${work.cost.toLocaleString("en-IN")}L`, flaggedOn: "Stored ML dataset", status: work.riskScore >= 80 ? "Open" : "Under review",
    details: `ML risk score ${work.riskScore}/100; progress ${work.progressPct}%, delay ${rowsById.get(work.id)?.delay_days || 0} days.`,
    recommendation: "Review source documents and verify the next field milestone before further release.",
  }));
  const groupedMps = new Map();
  works.forEach((work) => {
    const current = groupedMps.get(work.mp) || { id: `MP-${groupedMps.size + 1}`, name: work.mp, house: "Not recorded", constituency: work.constituency, state: work.state, party: "Not provided", sanctioned: 0, utilized: 0, recommendedCount: 0, completedCount: 0, openAlerts: 0, maxRisk: 0, sectors: {} };
    current.sanctioned += work.cost / 100; current.utilized += number(rowsById.get(work.id)?.expenditure_amount_inr) / 10000000;
    current.recommendedCount += 1; current.completedCount += work.status === "Completed" ? 1 : 0; current.openAlerts += work.riskScore >= 60 ? 1 : 0; current.maxRisk = Math.max(current.maxRisk, work.riskScore);
    groupedMps.set(work.mp, current);
  });
  const mps = [...groupedMps.values()].map((mp) => ({ ...mp, sanctioned: Math.round(mp.sanctioned * 100) / 100, utilized: Math.round(mp.utilized * 100) / 100, utilizationPct: mp.sanctioned ? Math.round(mp.utilized / mp.sanctioned * 100) : 0, sanctionedCount: mp.recommendedCount, riskLevel: mp.maxRisk >= 80 ? "High" : mp.maxRisk >= 60 ? "Medium" : "Low", avatar: mp.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() }));
  const statusCounts = new Map(); works.forEach((work) => statusCounts.set(work.status, (statusCounts.get(work.status) || 0) + 1));
  const colors = { Completed: "#138808", Ongoing: "#0B4C8C", Delayed: "#E07B1A", Stalled: "#B23A32" };
  const sanctioned = rows.reduce((total, row) => total + number(row.sanctioned_amount_inr), 0);
  const utilized = rows.reduce((total, row) => total + number(row.expenditure_amount_inr), 0);
  return { generatedAt: new Date().toISOString(), source: { label: "Bundled processed ML dataset", verified: false }, nationalOverview: { totalMps: mps.length, sanctioned: Math.round(sanctioned / 100000) / 100, utilized: Math.round(utilized / 100000) / 100, utilizationPct: sanctioned ? Math.round(utilized / sanctioned * 1000) / 10 : 0, totalWorksSanctioned: works.length, totalWorksCompleted: works.filter((work) => work.status === "Completed").length, openRiskAlerts: alerts.length }, works: works.slice(0, 600), alerts, mps: mps.slice(0, 600), statusStages: [...statusCounts].map(([name, value]) => ({ name, value, color: colors[name] })), worksNeedingAttention: works.filter((work) => number(rowsById.get(work.id)?.delay_days) > 0).sort((a, b) => number(rowsById.get(b.id)?.delay_days) - number(rowsById.get(a.id)?.delay_days)).slice(0, 8).map((work) => ({ name: work.name, state: work.state, days: number(rowsById.get(work.id)?.delay_days), reason: `${work.flagType}; physical progress ${work.progressPct}%` })), trendData: [], model: { datasetRows: rows.length, scoring: "Processed ML dataset fallback" } };
};

app.get("/health", async (_request, response, next) => {
  try {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM works");
    response.json({ status: "ok", database: "postgresql", records: rows[0].count });
  } catch (error) {
    const data = await fallbackUiData();
    response.json({ status: "ok", database: "bundled_ml_dataset", records: data.model.datasetRows });
  }
});

app.get("/api/dashboard", async (_request, response, next) => {
  try {
    const [totalsResult, statesResult] = await Promise.all([
      query(`SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE completion_status ILIKE 'completed')::int AS completed,
        COUNT(*) FILTER (WHERE is_anomaly OR risk_score >= 40)::int AS flagged,
        COALESCE(SUM(sanctioned_amount_inr), 0)::float AS sanctioned_amount,
        CASE WHEN COUNT(*) > 0 AND BOOL_AND(data_source = 'verified') THEN TRUE ELSE FALSE END AS verified
        FROM works`),
      query(`SELECT state AS name,
        COUNT(*)::int AS total,
        ROUND(AVG(physical_progress_pct))::int AS progress
        FROM works
        GROUP BY state
        ORDER BY progress DESC NULLS LAST, total DESC
        LIMIT 4`),
    ]);
    const totals = totalsResult.rows[0];
    const hasData = totals.total > 0;
    response.json({
      dataAvailable: hasData,
      generatedAt: new Date().toISOString(),
      source: hasData
        ? { verified: totals.verified, label: totals.verified ? "Verified PostgreSQL records" : "Synthetic demo records" }
        : { verified: false, label: "No records imported" },
      stats: hasData ? [
        { label: "Works in Database", value: totals.total },
        { label: "Sanctioned Value (INR)", value: totals.sanctioned_amount, format: "currency" },
        { label: "Works Completed", value: totals.completed },
        { label: "Works Requiring Review", value: totals.flagged },
      ] : [],
      states: statesResult.rows,
    });
  } catch (error) {
    const data = await fallbackUiData();
    const stateProgress = new Map();
    data.works.forEach((work) => {
      const current = stateProgress.get(work.state) || { name: work.state, total: 0, progress: 0 };
      current.total += 1; current.progress += work.progressPct; stateProgress.set(work.state, current);
    });
    const states = [...stateProgress.values()].map((state) => ({ ...state, progress: Math.round(state.progress / state.total) })).sort((a, b) => b.progress - a.progress).slice(0, 4);
    response.json({ dataAvailable: true, generatedAt: data.generatedAt, source: data.source, stats: [
      { label: "Works in Dataset", value: data.nationalOverview.totalWorksSanctioned },
      { label: "Sanctioned Value (INR)", value: data.nationalOverview.sanctioned * 10000000, format: "currency" },
      { label: "Works Completed", value: data.nationalOverview.totalWorksCompleted },
      { label: "Works Requiring Review", value: data.nationalOverview.openRiskAlerts },
    ], states });
  }
});

const workStatus = `CASE
  WHEN completion_status ILIKE 'completed' OR physical_progress_pct >= 100 THEN 'Completed'
  WHEN completion_status ILIKE '%stall%' THEN 'Stalled'
  WHEN delay_days > 0 THEN 'Delayed'
  ELSE 'Ongoing'
END`;

const riskLevel = `CASE WHEN risk_score >= 80 THEN 'High' WHEN risk_score >= 60 THEN 'Medium' ELSE 'Low' END`;

app.get("/api/ui-data", async (_request, response, next) => {
  try {
    const [summaryResult, worksResult, alertsResult, mpsResult, statusResult, delayedResult, trendResult, modelResult] = await Promise.all([
      query(`SELECT COUNT(*)::int AS total_works,
        COUNT(*) FILTER (WHERE completion_status ILIKE 'completed' OR physical_progress_pct >= 100)::int AS completed,
        COUNT(*) FILTER (WHERE risk_score >= 60)::int AS open_alerts,
        COALESCE(SUM(sanctioned_amount_inr), 0)::float AS sanctioned,
        COALESCE(SUM(expenditure_amount_inr), 0)::float AS utilized,
        COUNT(DISTINCT mp_name) FILTER (WHERE mp_name IS NOT NULL)::int AS total_mps
        FROM works`),
      query(`SELECT project_id AS id, COALESCE(description, project_id) AS name,
        COALESCE(project_type, 'Unclassified') AS sector, COALESCE(mp_name, 'Not recorded') AS mp,
        COALESCE(constituency, 'Not recorded') AS constituency, state, COALESCE(district, 'Not recorded') AS district,
        'District implementing agency' AS agency, ROUND(sanctioned_amount_inr / 100000.0, 2)::float AS cost,
        ROUND(released_amount_inr / 100000.0, 2)::float AS disbursed, ROUND(physical_progress_pct)::int AS "progressPct",
        ${workStatus} AS status, risk_score AS "riskScore", COALESCE(anomaly_type, 'None') AS "flagType",
        TO_CHAR(recommendation_start_date, 'DD Mon YYYY') AS "sanctionDate", 'Not recorded' AS "geoCoords"
        FROM works ORDER BY risk_score DESC, imported_at DESC LIMIT 600`),
      query(`SELECT project_id AS id, COALESCE(description, project_id) AS work,
        COALESCE(mp_name, 'Not recorded') AS mp, state, COALESCE(anomaly_type, 'Risk threshold exceeded') AS type,
        risk_score AS risk, CONCAT('₹', TO_CHAR(sanctioned_amount_inr / 100000.0, 'FM999G999G990D00'), 'L') AS amount,
        TO_CHAR(imported_at, 'DD Mon YYYY') AS "flaggedOn",
        CASE WHEN risk_score >= 80 THEN 'Open' WHEN risk_score >= 60 THEN 'Under review' ELSE 'Closed' END AS status,
        CONCAT('ML risk score ', risk_score, '/100. ', COALESCE(anomaly_type, 'No anomaly class supplied'),
          '; progress ', ROUND(physical_progress_pct), '%, delay ', delay_days, ' days.') AS details,
        'Review source documents and verify the next field milestone before further release.' AS recommendation
        FROM works WHERE risk_score >= 60 OR is_anomaly = TRUE ORDER BY risk_score DESC, imported_at DESC LIMIT 600`),
      query(`SELECT COALESCE(mp_name, 'Not recorded') AS name, MIN(house) AS house, MIN(constituency) AS constituency,
        MIN(state) AS state, 'Not provided' AS party, CONCAT('MP-', ROW_NUMBER() OVER (ORDER BY COALESCE(mp_name, 'Not recorded'))) AS id,
        ROUND(SUM(sanctioned_amount_inr) / 10000000.0, 2)::float AS sanctioned,
        ROUND(SUM(expenditure_amount_inr) / 10000000.0, 2)::float AS utilized,
        CASE WHEN SUM(sanctioned_amount_inr) > 0 THEN ROUND(100 * SUM(expenditure_amount_inr) / SUM(sanctioned_amount_inr))::int ELSE 0 END AS "utilizationPct",
        COUNT(*)::int AS "recommendedCount", COUNT(*)::int AS "sanctionedCount",
        COUNT(*) FILTER (WHERE completion_status ILIKE 'completed' OR physical_progress_pct >= 100)::int AS "completedCount",
        COUNT(*) FILTER (WHERE risk_score >= 60)::int AS "openAlerts",
        CASE WHEN MAX(risk_score) >= 80 THEN 'High' WHEN MAX(risk_score) >= 60 THEN 'Medium' ELSE 'Low' END AS "riskLevel"
        FROM works GROUP BY mp_name ORDER BY SUM(sanctioned_amount_inr) DESC LIMIT 600`),
      query(`SELECT ${workStatus} AS name, COUNT(*)::int AS value FROM works GROUP BY 1 ORDER BY 1`),
      query(`SELECT COALESCE(description, project_id) AS name, state, delay_days AS days,
        CONCAT(COALESCE(anomaly_type, 'Schedule delay'), '; physical progress ', ROUND(physical_progress_pct), '%') AS reason
        FROM works WHERE delay_days > 0 ORDER BY delay_days DESC, risk_score DESC LIMIT 8`),
      query(`SELECT TO_CHAR(COALESCE(snapshot_date, imported_at::date), 'Mon') AS month,
        ROUND(SUM(sanctioned_amount_inr) / 10000000.0, 2)::float AS sanctioned,
        ROUND(SUM(expenditure_amount_inr) / 10000000.0, 2)::float AS utilized
        FROM works GROUP BY DATE_TRUNC('month', COALESCE(snapshot_date, imported_at::date)), TO_CHAR(COALESCE(snapshot_date, imported_at::date), 'Mon')
        ORDER BY DATE_TRUNC('month', COALESCE(snapshot_date, imported_at::date)) LIMIT 12`),
      query("SELECT COUNT(*)::int AS rows, MAX(imported_at) AS last_imported_at FROM works"),
    ]);
    const summary = summaryResult.rows[0];
    const colors = { Completed: '#138808', Ongoing: '#0B4C8C', Delayed: '#E07B1A', Stalled: '#B23A32' };
    response.json({
      generatedAt: new Date().toISOString(),
      source: { label: 'PostgreSQL records', verified: true },
      nationalOverview: {
        totalMps: summary.total_mps, sanctioned: Number(summary.sanctioned) / 10000000,
        utilized: Number(summary.utilized) / 10000000,
        utilizationPct: Number(summary.sanctioned) ? Math.round(Number(summary.utilized) / Number(summary.sanctioned) * 1000) / 10 : 0,
        totalWorksSanctioned: summary.total_works, totalWorksCompleted: summary.completed, openRiskAlerts: summary.open_alerts,
      },
      works: worksResult.rows, alerts: alertsResult.rows,
      mps: mpsResult.rows.map((mp) => ({ ...mp, avatar: mp.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase(), sectors: {} })),
      statusStages: statusResult.rows.map((item) => ({ ...item, color: colors[item.name] || '#5B7A93' })),
      worksNeedingAttention: delayedResult.rows, trendData: trendResult.rows,
      model: { datasetRows: modelResult.rows[0].rows, lastImportedAt: modelResult.rows[0].last_imported_at, scoring: 'Persisted ML risk scores from PostgreSQL' },
    });
  } catch (error) {
    response.json(await fallbackUiData());
  }
});

app.get("/api/ml/status", async (_request, response, next) => {
  try {
    const { rows } = await query(`SELECT COUNT(*)::int AS rows, COUNT(*) FILTER (WHERE risk_score >= 60)::int AS flagged,
      MAX(imported_at) AS last_imported_at FROM works`);
    response.json({ available: true, scoring: "Persisted ML risk scores", ...rows[0] });
  } catch (error) {
    const data = await fallbackUiData();
    response.json({ available: true, scoring: data.model.scoring, rows: data.model.datasetRows, fallback: true });
  }
});

app.use((error, _request, response, _next) => {
  response.status(500).json({ error: "Unable to load the monitoring dataset." });
});

const server = app.listen(port, () => console.log(`MPLADS Node API listening on http://localhost:${port}`));

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

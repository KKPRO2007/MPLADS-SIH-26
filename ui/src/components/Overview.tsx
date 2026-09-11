"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Bell,
  Info,
} from "lucide-react";

/**
 * Overview
 * --------
 * All figures below are DEMO / SAMPLE data. Wire each section to your
 * FastAPI backend (e.g. GET /api/summary, GET /api/states, GET /api/stages)
 * and swap the constants for fetched state.
 */

// ---- Sample summary cards -------------------------------------------------
const SUMMARY_CARDS = [
  { label: "Total Works", value: 1240, icon: Briefcase, tone: "slate" },
  { label: "High Risk", value: 86, icon: ShieldAlert, tone: "red" },
  { label: "Medium Risk", value: 214, icon: AlertTriangle, tone: "amber" },
  { label: "Low Risk", value: 940, icon: ShieldCheck, tone: "green" },
  { label: "Delayed", value: 168, icon: Clock, tone: "slate" },
  { label: "Active Alerts", value: 32, icon: Bell, tone: "red" },
] as const;

const TONE_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  slate: { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200" },
  red: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
};

// ---- Sample state markers (approximate relative positions, not to scale) --
type StateMarker = {
  name: string;
  x: number; // % from left
  y: number; // % from top
  total: number;
  dominant: "low" | "medium" | "high";
};

const STATE_MARKERS: StateMarker[] = [
  { name: "Jammu & Kashmir", x: 38, y: 6, total: 12, dominant: "medium" },
  { name: "Punjab", x: 29, y: 19, total: 24, dominant: "low" },
  { name: "Himachal Pradesh", x: 39, y: 16, total: 10, dominant: "low" },
  { name: "Uttarakhand", x: 46, y: 20, total: 9, dominant: "low" },
  { name: "Delhi", x: 41, y: 25, total: 14, dominant: "high" },
  { name: "Rajasthan", x: 27, y: 31, total: 38, dominant: "medium" },
  { name: "Uttar Pradesh", x: 48, y: 29, total: 96, dominant: "high" },
  { name: "Bihar", x: 60, y: 31, total: 61, dominant: "medium" },
  { name: "West Bengal", x: 68, y: 36, total: 44, dominant: "medium" },
  { name: "Sikkim", x: 64, y: 21, total: 5, dominant: "low" },
  { name: "Assam", x: 77, y: 29, total: 28, dominant: "low" },
  { name: "Meghalaya", x: 74, y: 33, total: 8, dominant: "low" },
  { name: "Jharkhand", x: 60, y: 39, total: 33, dominant: "high" },
  { name: "Madhya Pradesh", x: 42, y: 43, total: 52, dominant: "medium" },
  { name: "Gujarat", x: 20, y: 43, total: 40, dominant: "low" },
  { name: "Chhattisgarh", x: 52, y: 47, total: 22, dominant: "medium" },
  { name: "Odisha", x: 60, y: 49, total: 30, dominant: "low" },
  { name: "Maharashtra", x: 31, y: 56, total: 88, dominant: "high" },
  { name: "Telangana", x: 45, y: 59, total: 35, dominant: "medium" },
  { name: "Andhra Pradesh", x: 47, y: 66, total: 41, dominant: "low" },
  { name: "Karnataka", x: 34, y: 69, total: 54, dominant: "medium" },
  { name: "Tamil Nadu", x: 42, y: 81, total: 60, dominant: "low" },
  { name: "Kerala", x: 33, y: 83, total: 26, dominant: "low" },
];

const RISK_DOT_COLOR: Record<StateMarker["dominant"], string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

// ---- Sample funnel stages --------------------------------------------------
const STAGES = [
  { label: "Received", value: 100, color: "bg-slate-700" },
  { label: "Sanctioned", value: 80, color: "bg-blue-600" },
  { label: "Processing", value: 60, color: "bg-indigo-500" },
  { label: "Payment", value: 40, color: "bg-amber-500" },
  { label: "Reviewed", value: 10, color: "bg-emerald-600" },
];

const FILTER_GROUPS = [
  { label: "State", options: ["All States", "Uttar Pradesh", "Maharashtra", "Bihar"] },
  { label: "District", options: ["All Districts"] },
  { label: "MP", options: ["All MPs"] },
  { label: "Risk Level", options: ["All", "High", "Medium", "Low"] },
];

export default function Overview() {
  const [hoveredState, setHoveredState] = useState<StateMarker | null>(null);
  const maxStage = useMemo(() => Math.max(...STAGES.map((s) => s.value)), []);

  return (
    <section id="overview" className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, tone }) => {
          const t = TONE_STYLES[tone];
          return (
            <div
              key={label}
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-inset ${t.ring}`}
            >
              <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${t.bg}`}>
                <Icon size={16} className={t.text} />
              </div>
              <p className="text-2xl font-semibold text-slate-900">{value.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-slate-500">{label}</p>
            </div>
          );
        })}
      </section>

      {/* Filters + Map */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left column: filters + model explainer */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Filters</h3>
            <div className="flex flex-col gap-4">
              {FILTER_GROUPS.map((group) => (
                <div key={group.label}>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    {group.label}
                  </label>
                  <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none">
                    {group.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Info size={15} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">How the model works</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Each work is scored using an unsupervised anomaly detector
              (Isolation Forest) combined with rule-based signals — cost
              deviation, delay days, progress gap and utilization ratio. The
              signals are merged into a single 0–100 risk score and grouped
              into Low, Medium and High bands.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Every flagged work shows a plain-language{" "}
              <span className="font-medium text-slate-700">“Why flagged?”</span>{" "}
              explanation. The system never confirms fraud — it surfaces
              cases for human review.
            </p>
          </div>
        </div>

        {/* Right column: stylized India risk map */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Projects across India
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" /> High
              </span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 sm:max-w-md">
            {/* soft grid backdrop for a "cool / technical" feel */}
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {STATE_MARKERS.map((s) => (
              <button
                key={s.name}
                onMouseEnter={() => setHoveredState(s)}
                onMouseLeave={() => setHoveredState(null)}
                onFocus={() => setHoveredState(s)}
                onBlur={() => setHoveredState(null)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                <span
                  className={`block rounded-full ${RISK_DOT_COLOR[s.dominant]} ring-2 ring-white transition-transform group-hover:scale-125`}
                  style={{
                    width: `${8 + Math.min(s.total, 100) / 8}px`,
                    height: `${8 + Math.min(s.total, 100) / 8}px`,
                  }}
                />
                <span
                  className={`absolute inset-0 rounded-full ${RISK_DOT_COLOR[s.dominant]} animate-ping opacity-20`}
                />
              </button>
            ))}

            {hoveredState && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
                style={{ left: `${hoveredState.x}%`, top: `${hoveredState.y - 3}%` }}
              >
                <p className="font-semibold text-slate-800">{hoveredState.name}</p>
                <p className="text-slate-500">{hoveredState.total} works tracked</p>
              </div>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Simplified state-wise placement for demo purposes — swap in a
            geo-accurate map (e.g. react-simple-maps + TopoJSON) for
            production.
          </p>
        </div>
      </section>

      {/* Stage funnel */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold text-slate-900">
          Works by stage
        </h3>
        <div className="flex flex-col gap-3">
          {STAGES.map((stage) => (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-medium text-slate-600 sm:w-28">
                {stage.label}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${stage.color}`}
                  style={{ width: `${(stage.value / maxStage) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs font-semibold text-slate-700">
                {stage.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

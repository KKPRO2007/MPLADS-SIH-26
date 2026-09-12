"use client";

import { useMemo, useState } from "react";
<<<<<<< HEAD
import { BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import IndiaMap, { type StateData } from "./IndiaMap";

const ANOMALY_WEIGHTS = [
  { factor: "Cost Deviation", weight: 35, color: "#ef4444" },
  { factor: "Physical Gap", weight: 30, color: "#f59e0b" },
  { factor: "Delay Days", weight: 20, color: "#3b82f6" },
  { factor: "Utilization Ratio", weight: 15, color: "#10b981" },
];
=======
import {
  Briefcase,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Bell,
  Info,
} from "lucide-react";
>>>>>>> d76566189a93b3ae4bc75ce560f94dc7d7919eb3

/**
 * Overview
 * --------
 * All figures below are DEMO / SAMPLE data. Wire each section to your
 * FastAPI backend (e.g. GET /api/summary, GET /api/states, GET /api/stages)
 * and swap the constants for fetched state.
 */

<<<<<<< HEAD
// ---- Sample state data -------------------------------------------------
const ALL_STATE_DATA: StateData[] = [
  { name: "Jammu & Kashmir",    total: 12, dominant: "medium" },
  { name: "Ladakh",             total: 3,  dominant: "low"    },
  { name: "Punjab",             total: 24, dominant: "low"    },
  { name: "Himachal Pradesh",   total: 10, dominant: "low"    },
  { name: "Uttarakhand",        total: 9,  dominant: "low"    },
  { name: "Delhi",              total: 14, dominant: "high"   },
  { name: "Haryana",            total: 21, dominant: "medium" },
  { name: "Rajasthan",          total: 38, dominant: "medium" },
  { name: "Uttar Pradesh",      total: 96, dominant: "high"   },
  { name: "Bihar",              total: 61, dominant: "medium" },
  { name: "West Bengal",        total: 44, dominant: "medium" },
  { name: "Sikkim",             total: 5,  dominant: "low"    },
  { name: "Assam",              total: 28, dominant: "low"    },
  { name: "Meghalaya",          total: 8,  dominant: "low"    },
  { name: "Mizoram",            total: 4,  dominant: "low"    },
  { name: "Nagaland",           total: 6,  dominant: "low"    },
  { name: "Manipur",            total: 7,  dominant: "low"    },
  { name: "Tripura",            total: 5,  dominant: "low"    },
  { name: "Arunachal Pradesh",  total: 6,  dominant: "low"    },
  { name: "Jharkhand",          total: 33, dominant: "high"   },
  { name: "Madhya Pradesh",     total: 52, dominant: "medium" },
  { name: "Gujarat",            total: 40, dominant: "low"    },
  { name: "Chhattisgarh",       total: 22, dominant: "medium" },
  { name: "Odisha",             total: 30, dominant: "low"    },
  { name: "Maharashtra",        total: 88, dominant: "high"   },
  { name: "Goa",                total: 6,  dominant: "low"    },
  { name: "Telangana",          total: 35, dominant: "medium" },
  { name: "Andhra Pradesh",     total: 41, dominant: "low"    },
  { name: "Karnataka",          total: 54, dominant: "medium" },
  { name: "Tamil Nadu",         total: 60, dominant: "low"    },
  { name: "Kerala",             total: 26, dominant: "low"    },
];

// ---- Sample funnel stages --------------------------------------------------
const STAGES = [
  { label: "Reviewed",    value: 10,  color: "bg-emerald-600" },
  { label: "Payment",     value: 40,  color: "bg-amber-500"   },
  { label: "Processing",  value: 60,  color: "bg-indigo-500"  },
  { label: "Sanctioned",  value: 80,  color: "bg-blue-600"    },
  { label: "Received",    value: 100, color: "bg-slate-700"   },
];

const STATE_OPTIONS = ["All States", ...ALL_STATE_DATA.map((s) => s.name).sort()];

export default function Overview() {
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedRisk, setSelectedRisk]   = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedMP, setSelectedMP] = useState("All MPs");

  const totalStageValue = useMemo(() => STAGES.reduce((sum, s) => sum + s.value, 0), []);

  // Filter state data based on selections
  const filteredStateData = useMemo<StateData[]>(() => {
    return ALL_STATE_DATA.filter((s) => {
      const riskMatch = selectedRisk === "All" || s.dominant === selectedRisk.toLowerCase();
      const stateMatch = selectedState === "All States" || s.name === selectedState;
      return riskMatch || stateMatch; // pass all through; map dims non-matching states
    });
  }, [selectedState, selectedRisk]);

  // Summary counts
  const filteredCounts = useMemo(() => {
    const relevant = ALL_STATE_DATA.filter((s) => {
      const riskMatch = selectedRisk === "All" || s.dominant === selectedRisk.toLowerCase();
      const stateMatch = selectedState === "All States" || s.name === selectedState;
      return riskMatch && stateMatch;
    });
    return {
      total: relevant.reduce((acc, s) => acc + s.total, 0),
      high:  relevant.filter((s) => s.dominant === "high").reduce((acc, s) => acc + s.total, 0),
      med:   relevant.filter((s) => s.dominant === "medium").reduce((acc, s) => acc + s.total, 0),
      low:   relevant.filter((s) => s.dominant === "low").reduce((acc, s) => acc + s.total, 0),
    };
  }, [selectedState, selectedRisk]);

  return (
    <section id="overview" className="w-full py-2">
      {/* Filters + Map */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left column: filters + model explainer */}
        <div className="flex flex-col gap-6">
          {/* Filters card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Filters</h3>
            <div className="flex flex-col gap-4">
              {/* State */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">State</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {STATE_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">District</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option>All Districts</option>
                </select>
              </div>

              {/* MP */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">MP</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                  value={selectedMP}
                  onChange={(e) => setSelectedMP(e.target.value)}
                >
                  <option>All MPs</option>
                </select>
              </div>

              {/* Risk Level */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Risk Level</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                >
                  {["All", "High", "Medium", "Low"].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live summary */}
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <div className="col-span-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Total works</span>
                <span className="text-sm font-bold text-slate-800">{filteredCounts.total}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> High
                </span>
                <span className="text-xs font-bold text-red-600">{filteredCounts.high}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="text-xs font-bold text-amber-600">{filteredCounts.med}</span>
              </div>
              <div className="col-span-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Low
                </span>
                <span className="text-xs font-bold text-emerald-600">{filteredCounts.low}</span>
              </div>
            </div>
          </div>

          {/* Model Risk Weighting Graph */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Model Risk Weighting</h3>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                AI Weights
              </span>
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Indicator contribution to total 0–100 anomaly score.
            </p>

            <div className="h-[170px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ANOMALY_WEIGHTS}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
                >
                  <XAxis type="number" hide domain={[0, 40]} />
                  <YAxis
                    type="category"
                    dataKey="factor"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#475569" }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    }}
                    formatter={(val) => [`${val}% Weight`, "Contribution"]}
                  />
                  <Bar dataKey="weight" radius={[0, 6, 6, 0]} barSize={16}>
                    {ANOMALY_WEIGHTS.map((entry) => (
                      <Cell key={entry.factor} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column: Real India choropleth map */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Projects across India</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {selectedState !== "All States" && `Showing: ${selectedState} · `}
                {selectedRisk !== "All" && `Risk: ${selectedRisk} · `}
                Hover a state for details
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Low
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-amber-500" /> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-red-500" /> High
              </span>
              <span className="flex items-center gap-1 opacity-50">
                <span className="h-3 w-3 rounded-sm bg-slate-200" /> No match
=======
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
>>>>>>> d76566189a93b3ae4bc75ce560f94dc7d7919eb3
              </span>
            </div>
          </div>

<<<<<<< HEAD
          <IndiaMap
            stateData={ALL_STATE_DATA}
            selectedState={selectedState}
            selectedRisk={selectedRisk}
            onSelectState={setSelectedState}
          />
        </div>
      </section>

      {/* Stage funnel - single continuous full-width line */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Works by stage</h3>
          <span className="text-xs font-medium text-slate-500">
            Total: <strong className="text-slate-800">{totalStageValue}</strong> works
          </span>
        </div>

        {/* 100% Seamless full-width continuous progress line (no text inside line) */}
        <div className="relative flex h-4 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60">
          {STAGES.map((stage) => {
            const pct = Math.round((stage.value / totalStageValue) * 100);
            return (
              <div
                key={stage.label}
                className={`h-full ${stage.color} transition-all hover:brightness-110 relative group`}
                style={{ width: `${(stage.value / totalStageValue) * 100}%` }}
              >
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-md group-hover:block z-20">
                  {stage.label}: {stage.value} ({pct}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* All stage names fully visible without truncation, aligned to the right side */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-2.5">
          {STAGES.map((stage) => {
            const pct = Math.round((stage.value / totalStageValue) * 100);
            return (
              <div key={stage.label} className="flex items-center gap-2 text-xs whitespace-nowrap">
                <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                <span className="font-semibold text-slate-800">{stage.label}:</span>
                <span className="font-bold text-slate-900">{stage.value}</span>
                <span className="text-slate-400">({pct}%)</span>
              </div>
            );
          })}
=======
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
>>>>>>> d76566189a93b3ae4bc75ce560f94dc7d7919eb3
        </div>
      </section>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
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

/**
 * Overview
 * --------
 * All figures below are DEMO / SAMPLE data. Wire each section to your
 * FastAPI backend (e.g. GET /api/summary, GET /api/states, GET /api/stages)
 * and swap the constants for fetched state.
 */

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
              </span>
            </div>
          </div>

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
        </div>
      </section>
    </section>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Header from "@/src/components/Header";
import {
  AlertTriangle,
  TrendingUp,
  Target,
  Search,
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
  Download,
  X,
  Building2,
  MapPin,
  UserCheck,
  FileText,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ---- Trend Data (Monthly Risk Alerts) ----
const TREND_DATA = [
  { month: "Oct 2025", highRisk: 22, mediumRisk: 54, lowRisk: 140 },
  { month: "Nov 2025", highRisk: 28, mediumRisk: 62, lowRisk: 155 },
  { month: "Dec 2025", highRisk: 35, mediumRisk: 70, lowRisk: 168 },
  { month: "Jan 2026", highRisk: 42, mediumRisk: 88, lowRisk: 180 },
  { month: "Feb 2026", highRisk: 39, mediumRisk: 95, lowRisk: 192 },
  { month: "Mar 2026", highRisk: 48, mediumRisk: 112, lowRisk: 210 },
];

const CATEGORY_DISTRIBUTION = [
  { category: "Physical Lag", count: 42, color: "#ef4444" },
  { category: "Cost Deviation", count: 35, color: "#f59e0b" },
  { category: "Fund Stall", count: 28, color: "#3b82f6" },
  { category: "Vendor Delay", count: 18, color: "#8b5cf6" },
];

// ---- Critical Focus Items ----
const FOCUS_ITEMS = [
  {
    id: "FOC-01",
    title: "Severe Cost-to-Physical Discrepancy",
    constituency: "Barpeta, Assam",
    mpName: "Abdul Khaleque",
    party: "INC",
    anomalyScore: 89,
    spendRatio: "18% spend ahead of physical progress",
    fundAmount: "₹2.40 Cr",
    urgency: "Immediate Audit Required",
    color: "border-red-500 bg-red-50/50",
    badgeColor: "bg-red-600 text-white",
  },
  {
    id: "FOC-02",
    title: "Fund Utilization Stall (>180 Days Unspent)",
    constituency: "Dausa, Rajasthan",
    mpName: "Jaskaur Meena",
    party: "BJP",
    anomalyScore: 76,
    spendRatio: "Vendor response pending for 6 months",
    fundAmount: "₹1.85 Cr",
    urgency: "Financial Intermediary Review",
    color: "border-amber-500 bg-amber-50/50",
    badgeColor: "bg-amber-500 text-white",
  },
  {
    id: "FOC-03",
    title: "Milestone Overdue & Non-Responsive Vendor",
    constituency: "Kozhikode, Kerala",
    mpName: "M. K. Raghavan",
    party: "INC",
    anomalyScore: 71,
    spendRatio: "Milestone overdue by 45 days",
    fundAmount: "₹95 Lakhs",
    urgency: "District Nodal Officer Escalation",
    color: "border-amber-500 bg-amber-50/50",
    badgeColor: "bg-amber-500 text-white",
  },
  {
    id: "FOC-04",
    title: "Multiple High-Risk Projects Cluster",
    constituency: "Lucknow, Uttar Pradesh",
    mpName: "Rajnath Singh",
    party: "BJP",
    anomalyScore: 68,
    spendRatio: "4 works flagged for physical delay",
    fundAmount: "₹4.10 Cr",
    urgency: "Site Inspection Scheduled",
    color: "border-blue-500 bg-blue-50/50",
    badgeColor: "bg-blue-600 text-white",
  },
];

// ---- Detailed MP Risk Dataset ----
const MP_DATASET = [
  {
    id: "MP-101",
    name: "Shri Rajnath Singh",
    house: "Lok Sabha",
    constituency: "Lucknow",
    state: "Uttar Pradesh",
    party: "BJP",
    totalSanctioned: "₹24.5 Cr",
    utilization: 84,
    totalWorks: 38,
    highRiskWorks: 4,
    mediumRiskWorks: 6,
    anomalyScore: 68,
    riskLevel: "High",
    status: "Under Review",
  },
  {
    id: "MP-102",
    name: "Shri Abdul Khaleque",
    house: "Lok Sabha",
    constituency: "Barpeta",
    state: "Assam",
    party: "INC",
    totalSanctioned: "₹18.0 Cr",
    utilization: 62,
    totalWorks: 28,
    highRiskWorks: 5,
    mediumRiskWorks: 4,
    anomalyScore: 89,
    riskLevel: "High",
    status: "Audit Flagged",
  },
  {
    id: "MP-103",
    name: "Smt. Jaskaur Meena",
    house: "Lok Sabha",
    constituency: "Dausa",
    state: "Rajasthan",
    party: "BJP",
    totalSanctioned: "₹21.0 Cr",
    utilization: 54,
    totalWorks: 32,
    highRiskWorks: 3,
    mediumRiskWorks: 8,
    anomalyScore: 76,
    riskLevel: "High",
    status: "Stalled Vendor",
  },
  {
    id: "MP-104",
    name: "Shri M. K. Raghavan",
    house: "Lok Sabha",
    constituency: "Kozhikode",
    state: "Kerala",
    party: "INC",
    totalSanctioned: "₹19.5 Cr",
    utilization: 78,
    totalWorks: 26,
    highRiskWorks: 2,
    mediumRiskWorks: 5,
    anomalyScore: 71,
    riskLevel: "Medium",
    status: "Overdue",
  },
  {
    id: "MP-105",
    name: "Dr. Harsh Vardhan",
    house: "Lok Sabha",
    constituency: "Chandni Chowk",
    state: "Delhi",
    party: "BJP",
    totalSanctioned: "₹22.0 Cr",
    utilization: 91,
    totalWorks: 42,
    highRiskWorks: 1,
    mediumRiskWorks: 3,
    anomalyScore: 34,
    riskLevel: "Low",
    status: "Satisfactory",
  },
  {
    id: "MP-106",
    name: "Shri Supriya Sule",
    house: "Lok Sabha",
    constituency: "Baramati",
    state: "Maharashtra",
    party: "NCP",
    totalSanctioned: "₹25.0 Cr",
    utilization: 88,
    totalWorks: 45,
    highRiskWorks: 2,
    mediumRiskWorks: 7,
    anomalyScore: 52,
    riskLevel: "Medium",
    status: "Monitored",
  },
  {
    id: "MP-107",
    name: "Shri Asaduddin Owaisi",
    house: "Lok Sabha",
    constituency: "Hyderabad",
    state: "Telangana",
    party: "AIMIM",
    totalSanctioned: "₹20.0 Cr",
    utilization: 80,
    totalWorks: 35,
    highRiskWorks: 1,
    mediumRiskWorks: 6,
    anomalyScore: 48,
    riskLevel: "Medium",
    status: "Satisfactory",
  },
  {
    id: "MP-108",
    name: "Smt. Mahua Moitra",
    house: "Lok Sabha",
    constituency: "Krishnanagar",
    state: "West Bengal",
    party: "AITC",
    totalSanctioned: "₹19.0 Cr",
    utilization: 73,
    totalWorks: 30,
    highRiskWorks: 3,
    mediumRiskWorks: 5,
    anomalyScore: 65,
    riskLevel: "High",
    status: "Under Review",
  },
  {
    id: "MP-109",
    name: "Shri Tejasvi Surya",
    house: "Lok Sabha",
    constituency: "Bangalore South",
    state: "Karnataka",
    party: "BJP",
    totalSanctioned: "₹23.5 Cr",
    utilization: 93,
    totalWorks: 48,
    highRiskWorks: 0,
    mediumRiskWorks: 2,
    anomalyScore: 18,
    riskLevel: "Low",
    status: "Optimal",
  },
  {
    id: "MP-110",
    name: "Shri K. T. Rama Rao",
    house: "Rajya Sabha",
    constituency: "Telangana State",
    state: "Telangana",
    party: "BRS",
    totalSanctioned: "₹22.5 Cr",
    utilization: 86,
    totalWorks: 36,
    highRiskWorks: 1,
    mediumRiskWorks: 4,
    anomalyScore: 39,
    riskLevel: "Low",
    status: "Satisfactory",
  },
];

export default function RiskMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [sortField, setSortField] = useState<"anomalyScore" | "highRiskWorks" | "utilization">("anomalyScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMPProfile, setSelectedMPProfile] = useState<(typeof MP_DATASET)[0] | null>(null);

  // State Options
  const stateOptions = useMemo(() => {
    const set = new Set(MP_DATASET.map((m) => m.state));
    return ["All", ...Array.from(set).sort()];
  }, []);

  // Filter & Sort Logic
  const filteredMPs = useMemo(() => {
    return MP_DATASET.filter((mp) => {
      const matchesSearch =
        mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState = selectedState === "All" || mp.state === selectedState;
      const matchesRisk = selectedRisk === "All" || mp.riskLevel === selectedRisk;

      return matchesSearch && matchesState && matchesRisk;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      return sortOrder === "desc" ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
    });
  }, [searchTerm, selectedState, selectedRisk, sortField, sortOrder]);

  const toggleSort = (field: "anomalyScore" | "highRiskWorks" | "utilization") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">




        {/* ================= SECTION 1: TRENDS & ANOMALY VELOCITY ================= */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <TrendingUp size={16} />
                <span>Section 1 · Trend Analysis</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Risk Trend & Anomaly Velocity
              </h2>
              <p className="text-xs text-slate-500">
                Monthly trajectory of flagged high, medium, and low risk MPLADS projects over the last 6 months.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1 text-xs font-semibold text-slate-700">
              <button className="rounded-md bg-white px-3 py-1.5 shadow-sm text-slate-900">6 Months</button>
              <button className="rounded-md px-3 py-1.5 text-slate-500 hover:text-slate-900">YTD</button>
              <button className="rounded-md px-3 py-1.5 text-slate-500 hover:text-slate-900">1 Year</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Area Chart */}
            <div className="h-[320px] w-full lg:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="highRiskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="medRiskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  />
                  <Area type="monotone" dataKey="highRisk" name="High Risk" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#highRiskGrad)" />
                  <Area type="monotone" dataKey="mediumRisk" name="Medium Risk" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#medRiskGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution Bar Chart */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-5">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Primary Anomaly Drivers</h3>
                <p className="mt-0.5 text-xs text-slate-500">Breakdown by AI signal classification</p>

                <div className="mt-6 flex flex-col gap-4">
                  {CATEGORY_DISTRIBUTION.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{item.category}</span>
                        <span className="font-bold">{item.count} cases</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(item.count / 42) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200/80 pt-3 text-right">
                <span className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                  View Anomaly Signal Algorithm Documentation &rarr;
                </span>
              </div>
            </div>
          </div>
        </section>



        {/* ================= SECTION 3: MP & CONSTITUENCY DATA TABLE ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <FileSpreadsheet size={16} />
                <span>Section 2 · Member of Parliament Directory & Risk Profiles</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                MP Constituency Risk Dataset
              </h2>
              <p className="text-xs text-slate-500">
                Comprehensive data of Members of Parliament, fund utilization, and flagged risk scores.
              </p>
            </div>

            {/* Controls: Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search MP, State or Constituency..."
                  className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* State Filter */}
              <div className="flex items-center gap-1.5">
                <Filter size={14} className="text-slate-400" />
                <select
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {stateOptions.map((st) => (
                    <option key={st} value={st}>State: {st}</option>
                  ))}
                </select>
              </div>

              {/* Risk Level Filter */}
              <select
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
              >
                <option value="All">Risk: All</option>
                <option value="High">Risk: High</option>
                <option value="Medium">Risk: Medium</option>
                <option value="Low">Risk: Low</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">MP Name & Party</th>
                  <th className="py-3.5 px-4">Constituency & State</th>
                  <th className="py-3.5 px-4">Sanctioned</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => toggleSort("utilization")}>
                    <div className="flex items-center gap-1">
                      Utilization % <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => toggleSort("highRiskWorks")}>
                    <div className="flex items-center gap-1">
                      High Risk Works <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => toggleSort("anomalyScore")}>
                    <div className="flex items-center gap-1">
                      Anomaly Score <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredMPs.map((mp) => (
                  <tr key={mp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{mp.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{mp.house} • <span className="font-semibold text-slate-700">{mp.party}</span></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{mp.constituency}</div>
                      <div className="text-[11px] text-slate-500">{mp.state}</div>
                    </td>
                    <td className="py-4 px-4 font-bold">{mp.totalSanctioned}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              mp.utilization >= 80
                                ? "bg-emerald-500"
                                : mp.utilization >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${mp.utilization}%` }}
                          />
                        </div>
                        <span className="font-bold">{mp.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {mp.highRiskWorks > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                          <AlertTriangle size={12} /> {mp.highRiskWorks} High
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">0 High</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-xs font-black ${
                          mp.anomalyScore >= 65
                            ? "bg-red-600 text-white"
                            : mp.anomalyScore >= 40
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {mp.anomalyScore}/100
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-700">{mp.status}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedMPProfile(mp)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:border-slate-300"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMPs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-600">No Member of Parliament records found matching your filters.</p>
              <p className="mt-1 text-xs text-slate-400">Try adjusting your search query or dropdown filter selections.</p>
            </div>
          )}
        </section>
      </main>

      {/* ================= MP PROFILE INTERACTIVE MODAL ================= */}
      {selectedMPProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-base border border-slate-200">
                  {selectedMPProfile.name.split(" ").slice(-1)[0][0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedMPProfile.name}</h2>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                      {selectedMPProfile.party}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-slate-400" /> {selectedMPProfile.house}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" /> {selectedMPProfile.constituency}, {selectedMPProfile.state}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMPProfile(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Stats & Intelligence */}
            <div className="mt-5 space-y-5">
              {/* Score & Risk Status Card */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Anomaly Risk Score</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{selectedMPProfile.anomalyScore}/100</span>
                    <span
                      className={`text-xs font-semibold ${
                        selectedMPProfile.riskLevel === "High"
                          ? "text-red-600"
                          : selectedMPProfile.riskLevel === "Medium"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      ({selectedMPProfile.riskLevel} Risk Level)
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border ${
                    selectedMPProfile.riskLevel === "High"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : selectedMPProfile.riskLevel === "Medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  Status: {selectedMPProfile.status}
                </span>
              </div>

              {/* Financial Metrics */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">MPLADS Fund Utilization</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-200 p-3 bg-white">
                    <span className="text-[11px] text-slate-500 font-medium">Sanctioned</span>
                    <p className="mt-1 text-base font-bold text-slate-900">{selectedMPProfile.totalSanctioned}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-white">
                    <span className="text-[11px] text-slate-500 font-medium">Utilized %</span>
                    <p className="mt-1 text-base font-bold text-slate-900">{selectedMPProfile.utilization}%</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-white">
                    <span className="text-[11px] text-slate-500 font-medium">High Risk Works</span>
                    <p className="mt-1 text-base font-bold text-red-600">{selectedMPProfile.highRiskWorks}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Fund Progress</span>
                    <span>{selectedMPProfile.utilization}% utilized</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full rounded-full ${
                        selectedMPProfile.utilization >= 80
                          ? "bg-emerald-600"
                          : selectedMPProfile.utilization >= 60
                          ? "bg-amber-500"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${selectedMPProfile.utilization}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sample Flagged Works under MP */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Tracked Projects ({selectedMPProfile.totalWorks} Total)</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-900">Community Hall & Solar Lighting Construction</h4>
                      <p className="mt-0.5 text-slate-500">{selectedMPProfile.constituency} Sector 4 • ₹45 Lakhs</p>
                    </div>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 border border-emerald-200">Completed</span>
                  </div>

                  {selectedMPProfile.highRiskWorks > 0 && (
                    <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/40 p-3 text-xs">
                      <div>
                        <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-red-600" />
                          Road Expansion & Culvert Repair
                        </h4>
                        <p className="mt-0.5 text-red-700/90">Spend is 18% ahead of physical progress • ₹1.2 Cr</p>
                      </div>
                      <span className="rounded bg-red-600 px-2 py-0.5 font-semibold text-white">High Risk</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800">
                <FileText size={14} />
                Download MP Audit Report
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedMPProfile(null)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm">
                  <Send size={13} />
                  Issue Nodal Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

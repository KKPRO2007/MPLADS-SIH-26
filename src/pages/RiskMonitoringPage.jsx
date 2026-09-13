import { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ShieldAlert,
  Users,
  HardHat,
  Clock,
  X,
  PieChart as PieIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import RiskPill from "../components/RiskPill.jsx";
import StatusTag from "../components/StatusTag.jsx";
import AlertDrawer from "../components/AlertDrawer.jsx";
import SectionCard from "../components/SectionCard.jsx";
import WorkDetailsModal from "../components/WorkDetailsModal.jsx";

const ALERT_RISK_FILTERS = [
  { key: "all", label: "All" },
  { key: "high", label: "High Risk" },
  { key: "medium", label: "Medium Risk" },
  { key: "low", label: "Low Risk" },
];

const displayRiskScore = (work) => Math.min(96, Math.max(20, Number(work.riskScore ?? work.risk ?? 20)));
const displayRiskLevel = (work) => work.riskLevel || (displayRiskScore(work) >= 70 ? "High" : displayRiskScore(work) >= 40 ? "Medium" : "Low");

export default function RiskMonitoringPage({ defaultTab = "works", data, error, user, onLogin }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const alerts = data?.alerts || [];
  const mpDirectory = data?.mps || [];
  const worksList = data?.works || [];
  const statusStages = data?.statusStages || [];
  const worksNeedingAttention = data?.worksNeedingAttention || [];

  // --- State for AI Anomaly Oversight ---
  const [alertRiskFilter, setAlertRiskFilter] = useState("all");
  const [alertQuery, setAlertQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  // --- State for MP Directory ---
  const [houseFilter, setHouseFilter] = useState("All");
  const [mpStateFilter, setMpStateFilter] = useState("All");
  const [partyFilter, setPartyFilter] = useState("All");
  const [mpQuery, setMpQuery] = useState("");
  const [selectedMp, setSelectedMp] = useState(null);

  // --- State for Work Progress ---
  const [workStatusFilter, setWorkStatusFilter] = useState("All");
  const [workSectorFilter, setWorkSectorFilter] = useState("All");
  const [workQuery, setWorkQuery] = useState("");
  const [selectedWork, setSelectedWork] = useState(null);

  // Memoized Filtered Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchesRisk =
        alertRiskFilter === "all" ||
        (alertRiskFilter === "high" && a.risk >= 80) ||
        (alertRiskFilter === "medium" && a.risk >= 60 && a.risk < 80) ||
        (alertRiskFilter === "low" && a.risk < 60);
      const matchesQuery =
        alertQuery.trim() === "" ||
        a.work.toLowerCase().includes(alertQuery.toLowerCase()) ||
        a.mp.toLowerCase().includes(alertQuery.toLowerCase()) ||
        a.state.toLowerCase().includes(alertQuery.toLowerCase());
      return matchesRisk && matchesQuery;
    });
  }, [alerts, alertRiskFilter, alertQuery]);

  // Memoized Filtered MPs
  const statesList = useMemo(() => ["All", ...new Set(mpDirectory.map((m) => m.state))], []);
  const partiesList = useMemo(() => ["All", ...new Set(mpDirectory.map((m) => m.party))], []);

  const filteredMps = useMemo(() => {
    return mpDirectory.filter((m) => {
      const matchHouse = houseFilter === "All" || m.house === houseFilter;
      const matchState = mpStateFilter === "All" || m.state === mpStateFilter;
      const matchParty = partyFilter === "All" || m.party === partyFilter;
      const matchQuery =
        mpQuery.trim() === "" ||
        m.name.toLowerCase().includes(mpQuery.toLowerCase()) ||
        m.constituency.toLowerCase().includes(mpQuery.toLowerCase()) ||
        m.state.toLowerCase().includes(mpQuery.toLowerCase());
      return matchHouse && matchState && matchParty && matchQuery;
    });
  }, [mpDirectory, houseFilter, mpStateFilter, partyFilter, mpQuery]);

  // Memoized Filtered Works
  const totalAssets = useMemo(() => statusStages.reduce((s, x) => s + x.value, 0), [statusStages]);

  const filteredWorks = useMemo(() => {
    return [...worksList].sort((left, right) => Number(right.riskScore || 0) - Number(left.riskScore || 0) || String(left.id).localeCompare(String(right.id))).filter((w) => {
      const matchStatus = workStatusFilter === "All" || w.status === workStatusFilter;
      const matchSector = workSectorFilter === "All" || w.sector.includes(workSectorFilter);
      const matchQuery =
        workQuery.trim() === "" ||
        w.name.toLowerCase().includes(workQuery.toLowerCase()) ||
        w.mp.toLowerCase().includes(workQuery.toLowerCase()) ||
        w.state.toLowerCase().includes(workQuery.toLowerCase()) ||
        w.district.toLowerCase().includes(workQuery.toLowerCase());
      return matchStatus && matchSector && matchQuery;
    });
  }, [worksList, workStatusFilter, workSectorFilter, workQuery]);

  return (
    <div className="flex flex-col gap-5">
      {!data && <div className="rounded border border-border bg-card p-4 text-[13px] text-muted" role="status">{error || "Loading live PostgreSQL and ML data…"}</div>}
      {/* Top Banner & Sub-Tabs Switcher */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl text-ink flex items-center gap-2">
              <HardHat className="text-navy" size={22} />
              MPLADS Work Progress &amp; Asset Directory
            </h2>
            <p className="text-[12.5px] text-muted">
              Official monitoring directory for project execution, milestone tracking, MP utilization profiles, and asset verification.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-paper border border-border rounded-[6px] p-1 gap-1">
            <button
              onClick={() => setActiveTab("works")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold rounded transition-all ${
                activeTab === "works" || activeTab === "alerts"
                  ? "bg-navy text-white shadow-xs"
                  : "text-subtle hover:text-ink hover:bg-white/50"
              }`}
            >
              <HardHat size={14} />
              <span>Work Progress &amp; Assets</span>
            </button>

            <button
              onClick={() => setActiveTab("mps")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold rounded transition-all ${
                activeTab === "mps"
                  ? "bg-navy text-white shadow-xs"
                  : "text-subtle hover:text-ink hover:bg-white/50"
              }`}
            >
              <Users size={14} />
              <span>MP Directory Profiles</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SUB-VIEW 1: AI ANOMALY OVERSIGHT          */}
      {/* ========================================== */}
      {activeTab === "alerts" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={alertQuery}
                onChange={(e) => setAlertQuery(e.target.value)}
                placeholder="Search by work, MP, or state..."
                className="w-full h-9 pl-9 pr-3 rounded-[4px] border border-border bg-card text-[13px] text-ink placeholder:text-muted outline-none focus:border-navy"
              />
            </div>
            <div className="flex items-center gap-1 bg-card border border-border rounded-[4px] p-1">
              {ALERT_RISK_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setAlertRiskFilter(f.key)}
                  className={
                    "text-[12px] px-3 py-1.5 rounded-[4px] font-semibold transition-colors " +
                    (alertRiskFilter === f.key
                      ? "bg-navy text-white"
                      : "text-subtle hover:bg-paper")
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-[6px] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-paper">
                  {["Alert ID", "Work Description", "MP / State", "Flag Type", "Amount", "Risk Score", "Audit Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-[11px] uppercase tracking-wide text-muted font-bold px-4 py-2.5"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((a, i) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAlert(a)}
                    className={
                      "cursor-pointer hover:bg-paper/80 transition-colors " +
                      (i !== 0 ? "border-t border-[#DDE3EA]" : "")
                    }
                  >
                    <td className="px-4 py-3 text-[12px] font-mono text-muted whitespace-nowrap">
                      {a.id}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-ink max-w-[240px] truncate">
                      {a.work}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-subtle whitespace-nowrap">
                      <span className="font-semibold text-ink">{a.mp}</span> · {a.state}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-subtle whitespace-nowrap">{a.type}</td>
                    <td className="px-4 py-3 text-[13px] text-ink font-bold tabular-nums whitespace-nowrap">
                      {a.amount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2"><RiskPill score={a.risk} /><span className="text-[11px] font-semibold text-subtle">{a.riskLevel || (a.risk >= 80 ? "High" : a.risk >= 60 ? "Medium" : "Low")}</span></div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight size={15} className="text-[#9AA9BA] inline-block" />
                    </td>
                  </tr>
                ))}
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-muted">
                      No anomaly alerts match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedAlert && (
            <AlertDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-VIEW 2: MP DIRECTORY PROFILES        */}
      {/* ========================================== */}
      {activeTab === "mps" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={mpQuery}
                onChange={(e) => setMpQuery(e.target.value)}
                placeholder="Search MP Name or Constituency..."
                className="w-full h-9 pl-9 pr-3 rounded border border-border bg-white text-[12.5px] text-ink placeholder:text-muted focus:outline-none focus:border-navy"
              />
            </div>

            <div className="flex items-center bg-white border border-border rounded p-1">
              {["All", "Lok Sabha", "Rajya Sabha"].map((h) => (
                <button
                  key={h}
                  onClick={() => setHouseFilter(h)}
                  className={`flex-1 py-1 text-[11.5px] font-semibold rounded text-center transition-all ${
                    houseFilter === h ? "bg-navy text-white" : "text-subtle hover:text-ink"
                  }`}
                >
                  {h === "All" ? "All Houses" : h}
                </button>
              ))}
            </div>

            <div>
              <select
                value={mpStateFilter}
                onChange={(e) => setMpStateFilter(e.target.value)}
                className="w-full h-9 px-3 rounded border border-border bg-white text-[12.5px] text-ink focus:outline-none focus:border-navy"
              >
                <option value="All">Filter by State (All)</option>
                {statesList
                  .filter((s) => s !== "All")
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <select
                value={partyFilter}
                onChange={(e) => setPartyFilter(e.target.value)}
                className="w-full h-9 px-3 rounded border border-border bg-white text-[12.5px] text-ink focus:outline-none focus:border-navy"
              >
                <option value="All">Filter by Party (All)</option>
                {partiesList
                  .filter((p) => p !== "All")
                  .map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[6px] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
                    <th className="px-4 py-3">Member of Parliament</th>
                    <th className="px-4 py-3">House &amp; Party</th>
                    <th className="px-4 py-3">Constituency / State</th>
                    <th className="px-4 py-3">Sanctioned</th>
                    <th className="px-4 py-3">Utilization Rate</th>
                    <th className="px-4 py-3 text-center">Open Alerts</th>
                    <th className="px-4 py-3">Risk Level</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMps.map((m, i) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMp(m)}
                      className={`cursor-pointer hover:bg-paper/80 transition-colors ${
                        i !== 0 ? "border-t border-[#DDE3EA]" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 text-[13px] text-ink font-semibold flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-navy text-saffron text-[12px] font-bold flex items-center justify-center shrink-0 border border-navy-light shadow-xs">
                          {m.avatar}
                        </span>
                        <div>
                          <div className="text-navy-dark font-bold hover:underline">{m.name}</div>
                          <div className="text-[11px] text-muted font-normal">{m.id}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-subtle">
                        <span className="font-semibold text-ink">{m.house}</span>
                        <span className="text-muted block text-[11px]">{m.party}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-subtle">
                        <div className="font-medium text-ink">{m.constituency}</div>
                        <div className="text-muted text-[11px]">{m.state}</div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-ink font-bold tabular-nums">
                        ₹{m.sanctioned}Cr
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[80px] h-[7px] bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-navy"
                              style={{ width: `${m.utilizationPct}%` }}
                            />
                          </div>
                          <span className="text-[12px] font-bold tabular-nums text-text">
                            {m.utilizationPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {m.openAlerts > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-[#FBE4E1] text-[#A32A20] px-2 py-0.5 rounded text-[11px] font-bold">
                            <ShieldAlert size={11} /> {m.openAlerts}
                          </span>
                        ) : (
                          <span className="text-muted text-[12px]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusTag
                          status={
                            m.riskLevel === "High"
                              ? "Open"
                              : m.riskLevel === "Medium"
                              ? "Under review"
                              : "Closed"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-[11.5px] text-accent font-bold hover:underline flex items-center gap-0.5 ml-auto">
                          View Profile <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMps.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-muted">
                        No MPs found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MP Profile Modal */}
          {selectedMp && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-[8px] border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="bg-navy text-white p-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-saffron text-black font-bold text-lg flex items-center justify-center border-2 border-white">
                      {selectedMp.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-xl text-white">
                          {selectedMp.name}
                        </h3>
                        <span className="bg-white/20 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                          {selectedMp.house}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#C5D7E8]">
                        {selectedMp.constituency}, {selectedMp.state} &middot; Party: {selectedMp.party}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMp(null)}
                    className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-paper p-3 rounded border border-border">
                      <div className="text-[11px] text-muted font-medium">Sanctioned Amount</div>
                      <div className="text-lg font-bold text-navy">₹{selectedMp.sanctioned} Cr</div>
                    </div>
                    <div className="bg-paper p-3 rounded border border-border">
                      <div className="text-[11px] text-muted font-medium">Utilized Expenditure</div>
                      <div className="text-lg font-bold text-green-700">₹{selectedMp.utilized} Cr</div>
                    </div>
                    <div className="bg-paper p-3 rounded border border-border">
                      <div className="text-[11px] text-muted font-medium">Utilization Rate</div>
                      <div className="text-lg font-bold text-ink">{selectedMp.utilizationPct}%</div>
                    </div>
                    <div className="bg-paper p-3 rounded border border-border">
                      <div className="text-[11px] text-muted font-medium">Recommended Works</div>
                      <div className="text-lg font-bold text-ink">{selectedMp.recommendedCount} Works</div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded p-4">
                    <h4 className="font-serif font-bold text-sm text-ink mb-3 flex items-center gap-1.5">
                      <PieIcon size={15} className="text-navy" /> Sector Allocation Breakdown (%)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(selectedMp.sectors).map(([sec, pct]) => (
                        <div key={sec} className="bg-paper p-2.5 rounded text-[12px]">
                          <span className="text-muted capitalize font-medium">{sec}:</span>{" "}
                          <strong className="text-navy font-bold">{pct}%</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-paper px-6 py-3 border-t border-border flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedMp(null)}
                    className="bg-navy text-white px-4 py-1.5 rounded text-[12px] font-semibold"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-VIEW 3: WORK PROGRESS & ASSETS        */}
      {/* ========================================== */}
      {activeTab === "works" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <SectionCard title="National Asset Execution Status" className="lg:col-span-2">
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusStages}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={76}
                      paddingAngle={2}
                    >
                      {statusStages.map((s) => (
                        <Cell key={s.name} fill={s.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                {statusStages.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ background: s.color }} />
                    <span className="text-text flex-1 font-medium">{s.name}</span>
                    <span className="text-ink tabular-nums font-bold">
                      {s.value.toLocaleString("en-IN")}
                    </span>
                    <span className="text-muted tabular-nums w-[40px] text-right font-medium">
                      {((s.value / totalAssets) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="High-Delay Works Requesting DM Action" className="lg:col-span-3">
              <div className="flex flex-col divide-y divide-border max-h-[500px] overflow-y-auto pr-1">
                {worksNeedingAttention.map((w) => (
                  <div key={w.name} className="flex items-center gap-3 py-2.5">
                    <Clock size={16} className="text-accent shrink-0" strokeWidth={2} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-ink font-semibold truncate">{w.name}</div>
                      <div className="text-[11.5px] text-muted">
                        {w.state} &middot;{" "}
                        <span className="text-[#B23A32] font-semibold">{w.reason}</span>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-bold text-[#B23A32] bg-[#FBE4E1] px-2 py-0.5 rounded shrink-0">
                      {w.days} days overdue
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif font-bold text-base text-ink">
                Sanctioned Works Explorer
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={workQuery}
                    onChange={(e) => setWorkQuery(e.target.value)}
                    placeholder="Search work, MP, district..."
                    className="w-full h-8 pl-8 pr-3 rounded border border-border bg-white text-[12px] text-ink focus:outline-none focus:border-navy"
                  />
                </div>

                <select
                  value={workStatusFilter}
                  onChange={(e) => setWorkStatusFilter(e.target.value)}
                  className="h-8 px-2.5 rounded border border-border bg-white text-[12px] text-ink focus:outline-none focus:border-navy"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Stalled">Stalled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
                    <th className="px-4 py-3">Work ID &amp; Description</th>
                    <th className="px-4 py-3">MP / District</th>
                    <th className="px-4 py-3">Executing Agency</th>
                    <th className="px-4 py-3">Cost</th>
                    <th className="px-4 py-3">Physical Progress</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3">Risk Level</th>
                    <th className="px-4 py-3">Anomaly Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorks.map((w, i) => (
                    <tr
                      key={w.id}
                      onClick={() => setSelectedWork(w)}
                      className={`cursor-pointer hover:bg-paper/80 transition-colors ${
                        i !== 0 ? "border-t border-[#DDE3EA]" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 text-[13px] text-ink font-semibold max-w-[260px]">
                        <div className="text-navy font-bold hover:underline truncate">{w.name}</div>
                        <div className="text-[11px] text-muted font-normal flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-subtle">{w.id}</span>
                          <span>&middot;</span>
                          <span className="text-navy font-medium">{w.sector.split("&")[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-subtle">
                        <div className="font-medium text-ink">{w.mp}</div>
                        <div className="text-muted text-[11px]">{w.district}, {w.state}</div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-subtle font-medium">
                        {w.agency}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-ink font-bold tabular-nums">
                        ₹{w.cost} Lakhs
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[70px] h-[7px] bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${w.progressPct}%`,
                                background:
                                  w.progressPct === 100
                                    ? "#138808"
                                    : w.progressPct < 50
                                    ? "#E07B1A"
                                    : "#0B4C8C",
                              }}
                            />
                          </div>
                          <span className="text-[12px] font-bold tabular-nums text-text">
                            {w.progressPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><RiskPill score={displayRiskScore(w)} /></td>
                      <td className="px-4 py-3"><span className="text-[12px] font-semibold text-subtle">{displayRiskLevel(w)}</span></td>
                      <td className="px-4 py-3 text-[12px] text-subtle">{w.flagType || "Not classified"}</td>
                      <td className="px-4 py-3">
                        <StatusTag
                          status={
                            w.status === "Completed"
                              ? "Closed"
                              : w.status === "Ongoing"
                              ? "Under review"
                              : "Open"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-[11.5px] text-accent font-bold hover:underline flex items-center gap-0.5 ml-auto">
                          Inspect <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <WorkDetailsModal
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
            user={user}
            onLogin={onLogin}
          />
        </div>
      )}
    </div>
  );
}

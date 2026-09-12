import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Search, Clock, HardHat, MapPin, CheckCircle, AlertTriangle, ChevronRight, X, ExternalLink, ShieldAlert } from "lucide-react";
import SectionCard from "../components/SectionCard.jsx";
import StatusTag from "../components/StatusTag.jsx";
import WorkDetailsModal from "../components/WorkDetailsModal.jsx";
import RiskPill from "../components/RiskPill.jsx";
import { statusStages, worksNeedingAttention, worksList } from "../data/mockData.js";

export default function WorkProgressPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedWork, setSelectedWork] = useState(null);

  const total = statusStages.reduce((s, x) => s + x.value, 0);

  const filteredWorks = useMemo(() => {
    return worksList.filter((w) => {
      const matchStatus = statusFilter === "All" || w.status === statusFilter;
      const matchSector = sectorFilter === "All" || w.sector.includes(sectorFilter);
      const matchQuery =
        query.trim() === "" ||
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.mp.toLowerCase().includes(query.toLowerCase()) ||
        w.state.toLowerCase().includes(query.toLowerCase()) ||
        w.district.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchSector && matchQuery;
    });
  }, [statusFilter, sectorFilter, query]);

  return (
    <div className="flex flex-col gap-4">
      {/* Work Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SectionCard title="National Asset Execution Status" className="lg:col-span-2">
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusStages} dataKey="value" nameKey="name" innerRadius={50} outerRadius={76} paddingAngle={2}>
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
                <span className="text-ink tabular-nums font-bold">{s.value.toLocaleString("en-IN")}</span>
                <span className="text-muted tabular-nums w-[40px] text-right font-medium">
                  {((s.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="High-Delay Works Requesting DM Action" className="lg:col-span-3">
          <div className="flex flex-col divide-y divide-border">
            {worksNeedingAttention.map((w, i) => (
              <div key={w.name} className="flex items-center gap-3 py-2.5">
                <Clock size={16} className="text-accent shrink-0" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-ink font-semibold truncate">{w.name}</div>
                  <div className="text-[11.5px] text-muted">
                    {w.state} &middot; <span className="text-[#B23A32] font-semibold">{w.reason}</span>
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

      {/* Interactive Asset Search & Explorer */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink">
              MPLADS Work Progress &amp; Asset Directory
            </h2>
            <p className="text-[12px] text-muted">
              Search sanctioned works by district, executing agency, physical progress, and geo-location.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search work, MP, district..."
                className="w-full h-8 pl-8 pr-3 rounded border border-border bg-white text-[12px] text-ink focus:outline-none focus:border-navy"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        {/* Works Table */}
        <div className="overflow-x-auto border border-border rounded">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
                <th className="px-4 py-3">Work ID &amp; Description</th>
                <th className="px-4 py-3">MP / District</th>
                <th className="px-4 py-3">Executing Agency</th>
                <th className="px-4 py-3">Sanctioned Cost</th>
                <th className="px-4 py-3">Physical Progress</th>
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
                            background: w.progressPct === 100 ? "#138808" : w.progressPct < 50 ? "#E07B1A" : "#0B4C8C",
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-bold tabular-nums text-text">{w.progressPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusTag
                      status={w.status === "Completed" ? "Closed" : w.status === "Ongoing" ? "Under review" : "Open"}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[11.5px] text-accent font-bold hover:underline flex items-center gap-0.5 ml-auto">
                      Inspect <ChevronRight size={13} />
                    </button>
                  </td>
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Search, Clock, HardHat, MapPin, CheckCircle, AlertTriangle, ChevronRight, X, ExternalLink, ShieldAlert } from "lucide-react";
import SectionCard from "../components/SectionCard.jsx";
import StatusTag from "../components/StatusTag.jsx";
import WorkDetailsModal from "../components/WorkDetailsModal.jsx";
import RiskPill from "../components/RiskPill.jsx";
import { statusStages, worksNeedingAttention, worksList } from "../data/mockData.js";

export default function WorkProgressPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedWork, setSelectedWork] = useState(null);

  const total = statusStages.reduce((s, x) => s + x.value, 0);

  const filteredWorks = useMemo(() => {
    return worksList.filter((w) => {
      const matchStatus = statusFilter === "All" || w.status === statusFilter;
      const matchSector = sectorFilter === "All" || w.sector.includes(sectorFilter);
      const matchQuery =
        query.trim() === "" ||
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.mp.toLowerCase().includes(query.toLowerCase()) ||
        w.state.toLowerCase().includes(query.toLowerCase()) ||
        w.district.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchSector && matchQuery;
    });
  }, [statusFilter, sectorFilter, query]);

  return (
    <div className="flex flex-col gap-4">
      {/* Work Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SectionCard title="National Asset Execution Status" className="lg:col-span-2">
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusStages} dataKey="value" nameKey="name" innerRadius={50} outerRadius={76} paddingAngle={2}>
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
                <span className="text-ink tabular-nums font-bold">{s.value.toLocaleString("en-IN")}</span>
                <span className="text-muted tabular-nums w-[40px] text-right font-medium">
                  {((s.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="High-Delay Works Requesting DM Action" className="lg:col-span-3">
          <div className="flex flex-col divide-y divide-border">
            {worksNeedingAttention.map((w, i) => (
              <div key={w.name} className="flex items-center gap-3 py-2.5">
                <Clock size={16} className="text-accent shrink-0" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-ink font-semibold truncate">{w.name}</div>
                  <div className="text-[11.5px] text-muted">
                    {w.state} &middot; <span className="text-[#B23A32] font-semibold">{w.reason}</span>
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

      {/* Interactive Asset Search & Explorer */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink">
              MPLADS Work Progress &amp; Asset Directory
            </h2>
            <p className="text-[12px] text-muted">
              Search sanctioned works by district, executing agency, physical progress, and geo-location.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search work, MP, district..."
                className="w-full h-8 pl-8 pr-3 rounded border border-border bg-white text-[12px] text-ink focus:outline-none focus:border-navy"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        {/* Works Table */}
        <div className="overflow-x-auto border border-border rounded">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
                <th className="px-4 py-3">Work ID &amp; Description</th>
                <th className="px-4 py-3">MP / District</th>
                <th className="px-4 py-3">Executing Agency</th>
                <th className="px-4 py-3">Sanctioned Cost</th>
                <th className="px-4 py-3">Physical Progress</th>
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
                            background: w.progressPct === 100 ? "#138808" : w.progressPct < 50 ? "#E07B1A" : "#0B4C8C",
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-bold tabular-nums text-text">{w.progressPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusTag
                      status={w.status === "Completed" ? "Closed" : w.status === "Ongoing" ? "Under review" : "Open"}
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
      />
    </div>
  );
}

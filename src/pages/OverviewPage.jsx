import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
} from "recharts";
import {
  IndianRupee,
  Gauge,
  HardHat,
  ShieldAlert,
  ChevronRight,
  Building2,
  Landmark,
  PieChart,
} from "lucide-react";
import KpiCard from "../components/KpiCard.jsx";
import SectionCard from "../components/SectionCard.jsx";
import RiskPill from "../components/RiskPill.jsx";
import ChartTooltip from "../components/ChartTooltip.jsx";
export default function OverviewPage({ goToAlerts, goToMps, data, error }) {
  const [selectedHouse, setSelectedHouse] = useState("all");
  const houseData = data?.nationalOverview;
  const trendData = data?.trendData || [];
  const alerts = data?.alerts || [];

  if (!houseData) return <div className="rounded border border-border bg-card p-8 text-center text-muted" role="status">{error || "Loading live PostgreSQL and ML data…"}</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Official Government Hero Banner & House Selector */}
      <div className="bg-gradient-to-r from-[#0B3B60] via-[#0E4B7A] to-[#0B3B60] rounded-[6px] p-5 text-white shadow-sm border border-navy-light/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-6 -translate-y-4">
          <Landmark size={240} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-saffron/20 border border-saffron/40 text-saffron px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-2">
              <Building2 size={13} /> MPLADS Monitoring
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              MPLADS AI-Powered Monitoring System
            </h2>
            <p className="text-[12.5px] text-[#C5D7E8] max-w-2xl mt-1 leading-relaxed">
              Clear oversight for fund utilization, sanctioned works, asset progress, and AI risk flags across constituencies.
            </p>
          </div>

          {/* Lok Sabha vs Rajya Sabha Filter Selector */}
          <div className="bg-navy-dark/80 backdrop-blur border border-white/20 p-1.5 rounded-[6px] flex items-center gap-1 shrink-0">
            <button
              onClick={() => setSelectedHouse("all")}
              className={`px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
                selectedHouse === "all"
                  ? "bg-saffron text-black font-bold shadow-xs"
                  : "text-[#B9C9D9] hover:text-white"
              }`}
            >
              All MPs ({houseData.totalMps})
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Sanctioned"
          value={`₹${houseData.sanctioned}Cr`}
          sub={`Database total for ${houseData.totalMps} MPs`}
          subTone="flat"
          icon={IndianRupee}
        />
        <KpiCard
          label="Fund Utilization Rate"
          value={`${houseData.utilizationPct}%`}
          sub={`₹${houseData.utilized}Cr spent in field`}
          subTone="up"
          icon={Gauge}
        />
        <KpiCard
          label="Sanctioned Works"
          value={houseData.totalWorksSanctioned.toLocaleString("en-IN")}
          sub={`${houseData.totalWorksCompleted.toLocaleString("en-IN")} completed`}
          subTone="flat"
          icon={HardHat}
        />
        <KpiCard
          label="Active AI Anomaly Risk"
          value={houseData.openRiskAlerts}
          sub="Flagged for audit review"
          subTone="down"
          icon={ShieldAlert}
        />
      </div>

      {/* National Fund Flow & Anomalies by Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SectionCard
          title="National Fund Flow Trajectory"
          className="lg:col-span-3"
          action={<span className="text-[12px] text-muted">₹ Crore (latest 12 dataset months)</span>}
        >
          <div style={{ width: "100%", height: 230 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#DDE3EA" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7A8C" }} axisLine={{ stroke: "#D6DCE3" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7A8C" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="sanctioned" name="Sanctioned" stroke="#0B4C8C" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="utilized" name="Utilized" stroke="#138808" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-[12px] text-subtle font-medium border-t border-border/40 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ background: "#0B4C8C" }} /> Sanctioned Funds
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ background: "#138808" }} /> Utilized Expenditure
            </span>
          </div>
        </SectionCard>

        <SectionCard
          title="Highest-Risk Anomaly Alerts"
          className="lg:col-span-2"
          action={
            <button onClick={goToAlerts} className="text-[12px] text-accent font-bold flex items-center gap-0.5 hover:underline">
              View All 34 Alerts <ChevronRight size={13} />
            </button>
          }
        >
          <div className="flex flex-col">
            {alerts.slice(0, 5).map((a, i) => (
              <div
                key={a.id}
                onClick={goToAlerts}
                className={"flex items-center gap-2.5 py-2 cursor-pointer hover:bg-paper/80 px-1 rounded transition-colors " + (i !== 0 ? "border-t border-[#DDE3EA]" : "")}
              >
                <RiskPill score={a.risk} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] text-ink font-semibold truncate">{a.work}</div>
                  <div className="text-[11px] text-muted flex items-center gap-1.5 flex-wrap">
                    <span>{a.mp}</span>
                    <span>&middot;</span>
                    <span className="text-subtle font-medium">{a.state}</span>
                    <span>&middot;</span>
                    <span className="text-[#B23A32] font-semibold">{a.type}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[12.5px] text-ink font-bold tabular-nums">{a.amount}</div>
                  <div className="text-[10px] text-muted">{a.flaggedOn}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

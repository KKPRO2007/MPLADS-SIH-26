import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PieChart as PieIcon, Route, Droplets, GraduationCap, HeartPulse, Sun, Building2 } from "lucide-react";
import SectionCard from "../components/SectionCard.jsx";
import ChartTooltip from "../components/ChartTooltip.jsx";
import { sectorAllocations } from "../data/mockData.js";

const SECTOR_ICONS = {
  roads: Route,
  water: Droplets,
  education: GraduationCap,
  health: HeartPulse,
  solar: Sun,
  community: Building2,
};

export default function SectorAnalyticsPage() {
  const chartData = sectorAllocations.map((s) => ({
    name: s.sector.split("&")[0],
    allocated: s.allocated,
    utilized: s.utilized,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Header Info */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
        <h2 className="font-serif font-bold text-lg text-ink">
          Sector-Wise Spending &amp; Asset Analytics
        </h2>
        <p className="text-[12px] text-muted">
          Comprehensive analysis of MPLADS fund utilization across key development sectors: Infrastructure, Drinking Water, Education, Healthcare, and Clean Energy.
        </p>
      </div>

      {/* Sector Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SectionCard title="Sanctioned vs Utilized by Sector" className="lg:col-span-3" action={<span className="text-[12px] text-muted">₹ Crore</span>}>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid stroke="#DDE3EA" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6B7A8C" }}
                  axisLine={{ stroke: "#D6DCE3" }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: "#6B7A8C" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="allocated" name="Allocated" fill="#0B4C8C" radius={[3, 3, 0, 0]} />
                <Bar dataKey="utilized" name="Utilized" fill="#138808" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-[12px] text-subtle font-medium border-t border-border pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ background: "#0B4C8C" }} /> Allocated Funds (₹ Cr)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ background: "#138808" }} /> Utilized Expenditure (₹ Cr)
            </span>
          </div>
        </SectionCard>

        {/* Sector Proportion Pie */}
        <SectionCard title="Sector Share (%)" className="lg:col-span-2">
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sectorAllocations} dataKey="allocated" nameKey="sector" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {sectorAllocations.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            {sectorAllocations.map((s) => (
              <div key={s.key} className="flex items-center gap-2 text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-ink font-medium flex-1 truncate">{s.sector}</span>
                <span className="text-navy font-bold tabular-nums">₹{s.allocated}Cr</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectorAllocations.map((sec) => {
          const Icon = SECTOR_ICONS[sec.key] || PieIcon;
          const utilPct = ((sec.utilized / sec.allocated) * 100).toFixed(0);
          return (
            <div key={sec.key} className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {utilPct}% Utilized
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-ink">{sec.sector}</h3>
                <div className="text-[20px] font-bold text-navy mt-1 tabular-nums">₹{sec.allocated} Cr</div>
                <p className="text-[11.5px] text-muted mt-0.5">{sec.count.toLocaleString("en-IN")} works sanctioned nationwide</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11.5px]">
                <span className="text-subtle font-medium">Completed Assets:</span>
                <strong className="text-ink font-bold">{Math.round(sec.count * 0.72).toLocaleString("en-IN")} Assets</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

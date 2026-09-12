import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, IndianRupee, Landmark, ArrowRight, ShieldAlert } from "lucide-react";
import SectionCard from "../components/SectionCard.jsx";
import ChartTooltip from "../components/ChartTooltip.jsx";
import { stateRisk, fundWaterfall } from "../data/mockData.js";

export default function FundFlowPage() {
  const chartData = stateRisk.map((s) => ({
    state: s.state,
    sanctioned: s.sanctioned,
    utilized: s.utilized,
    unspent: s.unspent,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Header Summary */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
        <h2 className="font-serif font-bold text-lg text-ink">
          MPLADS Financial Flow &amp; Waterfall Architecture
        </h2>
        <p className="text-[12px] text-muted">
          Tracking fund movement from MoSPI Central Treasury to District Collector Nodal Accounts, Executing Agency Disbursements, and Field Expenditures.
        </p>
      </div>

      {/* Financial Flow Pipeline / Waterfall Cards */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
        <h3 className="font-serif font-bold text-sm text-ink mb-3 flex items-center gap-2">
          <Landmark size={16} className="text-navy" /> Fund Flow Pipeline (FY 2026-27)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {fundWaterfall.map((stage, idx) => (
            <div
              key={stage.stage}
              className="bg-paper border border-border p-3 rounded flex flex-col justify-between relative overflow-hidden"
            >
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Stage {idx + 1}
              </div>
              <div className="text-[12px] font-bold text-ink mt-1 leading-snug">
                {stage.stage}
              </div>
              <div className="text-[18px] font-bold mt-2 tabular-nums" style={{ color: stage.color }}>
                ₹{stage.amount} Cr
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State Sanctioned vs Utilized Bar Chart */}
      <SectionCard title="State Financial Sanctions vs Field Expenditure" action={<span className="text-[12px] text-muted">₹ Crore</span>}>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 35 }}>
              <CartesianGrid stroke="#DDE3EA" vertical={false} />
              <XAxis
                dataKey="state"
                tick={{ fontSize: 11, fill: "#6B7A8C" }}
                axisLine={{ stroke: "#D6DCE3" }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12, fill: "#6B7A8C" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="sanctioned" name="Sanctioned" fill="#0B4C8C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="utilized" name="Utilized" fill="#138808" radius={[3, 3, 0, 0]} />
              <Bar dataKey="unspent" name="Unspent" fill="#B23A32" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 text-[12px] text-subtle font-medium border-t border-border pt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs" style={{ background: "#0B4C8C" }} /> Sanctioned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs" style={{ background: "#138808" }} /> Utilized
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs" style={{ background: "#B23A32" }} /> Unspent Balance
          </span>
        </div>
      </SectionCard>

      {/* State Financial Breakdown Table */}
      <div className="bg-card border border-border rounded-[6px] overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
              <th className="px-4 py-3">State / Union Territory</th>
              <th className="px-4 py-3">Works Sanctioned</th>
              <th className="px-4 py-3">Sanctioned (₹ Cr)</th>
              <th className="px-4 py-3">Utilized (₹ Cr)</th>
              <th className="px-4 py-3">Unspent Balance</th>
              <th className="px-4 py-3">Risk Exposure</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {stateRisk.map((s, i) => (
              <tr key={s.state} className={i !== 0 ? "border-t border-[#DDE3EA]" : ""}>
                <td className="px-4 py-3 text-[13px] text-ink font-bold">{s.state}</td>
                <td className="px-4 py-3 text-[13px] text-subtle tabular-nums font-semibold">{s.works.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-[13px] text-navy font-bold tabular-nums">₹{s.sanctioned}Cr</td>
                <td className="px-4 py-3 text-[13px] text-green-700 font-bold tabular-nums">₹{s.utilized}Cr</td>
                <td className="px-4 py-3 text-[13px] text-[#B23A32] font-bold tabular-nums">₹{s.unspent}Cr</td>
                <td className="px-4 py-3">
                  <span
                    className="text-[12px] font-bold px-2 py-0.5 rounded"
                    style={{
                      background: s.riskPct >= 5 ? "#FBE4E1" : s.riskPct >= 3.5 ? "#FDF0D9" : "#E1F0E5",
                      color: s.riskPct >= 5 ? "#A32A20" : s.riskPct >= 3.5 ? "#8A5F17" : "#1F6B37",
                    }}
                  >
                    {s.riskPct}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.trend === "up" && (
                    <span className="text-[12px] text-[#A32A20] font-semibold flex items-center gap-1">
                      <TrendingUp size={13} /> Rising
                    </span>
                  )}
                  {s.trend === "down" && (
                    <span className="text-[12px] text-[#138808] font-semibold flex items-center gap-1">
                      <TrendingDown size={13} /> Easing
                    </span>
                  )}
                  {s.trend === "flat" && <span className="text-[12px] text-muted font-medium">Stable</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

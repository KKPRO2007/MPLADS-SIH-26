import { useState, useMemo } from "react";
import { Search, MapPin, TrendingUp, TrendingDown, IndianRupee, HardHat, AlertTriangle, ChevronRight } from "lucide-react";
import { stateRisk } from "../data/mockData.js";

export default function StateExplorerPage() {
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const filteredStates = useMemo(() => {
    return stateRisk.filter((s) =>
      s.state.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const totalNationalSanctioned = stateRisk.reduce((acc, s) => acc + s.sanctioned, 0);
  const totalNationalUtilized = stateRisk.reduce((acc, s) => acc + s.utilized, 0);
  const totalUnspent = stateRisk.reduce((acc, s) => acc + s.unspent, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
          <div className="text-[12px] text-muted font-medium uppercase tracking-wider">Total State Sanctions</div>
          <div className="text-2xl font-bold text-navy mt-1">₹{totalNationalSanctioned.toFixed(1)} Cr</div>
          <div className="text-[11px] text-subtle mt-0.5">Across 28 States &amp; 8 UTs</div>
        </div>

        <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
          <div className="text-[12px] text-muted font-medium uppercase tracking-wider">State Expenditure</div>
          <div className="text-2xl font-bold text-green-700 mt-1">₹{totalNationalUtilized.toFixed(1)} Cr</div>
          <div className="text-[11px] text-green-800 font-semibold mt-0.5">
            {((totalNationalUtilized / totalNationalSanctioned) * 100).toFixed(1)}% National Utilization
          </div>
        </div>

        <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
          <div className="text-[12px] text-muted font-medium uppercase tracking-wider">Unspent Balance</div>
          <div className="text-2xl font-bold text-[#B23A32] mt-1">₹{totalUnspent.toFixed(1)} Cr</div>
          <div className="text-[11px] text-muted mt-0.5">With District Authority Treasuries</div>
        </div>
      </div>

      {/* State Search & Grid */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink">
              State &amp; Union Territory Explorer
            </h2>
            <p className="text-[12px] text-muted">
              Drill down into MPLADS allocation, district progress, and anomaly flags state-by-state.
            </p>
          </div>

          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search State or UT..."
              className="w-full h-8 pl-8 pr-3 rounded border border-border bg-white text-[12px] text-ink focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* State Table */}
        <div className="overflow-x-auto border border-border rounded mt-2">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
                <th className="px-4 py-3">State / UT Name</th>
                <th className="px-4 py-3">MPs</th>
                <th className="px-4 py-3">Sanctioned (₹ Cr)</th>
                <th className="px-4 py-3">Utilized (₹ Cr)</th>
                <th className="px-4 py-3">Unspent Balance</th>
                <th className="px-4 py-3">Flagged Works</th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((s, i) => {
                const utilPct = ((s.utilized / s.sanctioned) * 100).toFixed(1);
                return (
                  <tr
                    key={s.state}
                    onClick={() => setSelectedState(s)}
                    className={`cursor-pointer hover:bg-paper/80 transition-colors ${
                      i !== 0 ? "border-t border-[#DDE3EA]" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 text-[13px] text-ink font-bold flex items-center gap-2">
                      <MapPin size={15} className="text-navy shrink-0" />
                      <span className="hover:underline text-navy">{s.state}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink font-semibold tabular-nums">{s.mps} MPs</td>
                    <td className="px-4 py-3 text-[13px] text-ink font-bold tabular-nums">₹{s.sanctioned}Cr</td>
                    <td className="px-4 py-3 text-[13px] text-green-700 font-bold tabular-nums">
                      ₹{s.utilized}Cr ({utilPct}%)
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#B23A32] font-semibold tabular-nums">
                      ₹{s.unspent}Cr
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink tabular-nums">{s.flagged}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[12px] font-bold px-2 py-0.5 rounded"
                        style={{
                          background: s.riskPct >= 5 ? "#FBE4E1" : s.riskPct >= 3.5 ? "#FDF0D9" : "#E1F0E5",
                          color: s.riskPct >= 5 ? "#A32A20" : s.riskPct >= 3.5 ? "#8A5F17" : "#1F6B37",
                        }}
                      >
                        {s.riskPct}% Risk ({s.trend === "up" ? "▲ Rising" : s.trend === "down" ? "▼ Easing" : "● Stable"})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Search, Filter, X, ChevronRight, PieChart, HardHat, ShieldAlert, Award, Landmark, CheckCircle, AlertTriangle } from "lucide-react";
import StatusTag from "../components/StatusTag.jsx";
import RiskPill from "../components/RiskPill.jsx";
import { mpDirectory, worksList, alerts } from "../data/mockData.js";

export default function MpDirectoryPage() {
  const [houseFilter, setHouseFilter] = useState("All"); // 'All', 'Lok Sabha', 'Rajya Sabha'
  const [stateFilter, setStateFilter] = useState("All");
  const [partyFilter, setPartyFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedMp, setSelectedMp] = useState(null);

  const statesList = ["All", ...new Set(mpDirectory.map((m) => m.state))];
  const partiesList = ["All", ...new Set(mpDirectory.map((m) => m.party))];

  const filteredMps = useMemo(() => {
    return mpDirectory.filter((m) => {
      const matchHouse = houseFilter === "All" || m.house === houseFilter;
      const matchState = stateFilter === "All" || m.state === stateFilter;
      const matchParty = partyFilter === "All" || m.party === partyFilter;
      const matchQuery =
        query.trim() === "" ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.constituency.toLowerCase().includes(query.toLowerCase()) ||
        m.state.toLowerCase().includes(query.toLowerCase());
      return matchHouse && matchState && matchParty && matchQuery;
    });
  }, [houseFilter, stateFilter, partyFilter, query]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header Controls & Filters */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink">
              Member of Parliament (MP) Performance Directory
            </h2>
            <p className="text-[12px] text-muted">
              Explore MPLADS fund utilization, works recommended, and risk audit profiles for Lok Sabha &amp; Rajya Sabha MPs.
            </p>
          </div>

          {/* House Filter Tabs */}
          <div className="flex items-center bg-paper border border-border rounded-[6px] p-1">
            {["All", "Lok Sabha", "Rajya Sabha"].map((h) => (
              <button
                key={h}
                onClick={() => setHouseFilter(h)}
                className={`px-3 py-1 text-[12px] font-semibold rounded transition-all ${
                  houseFilter === h ? "bg-navy text-white shadow-xs" : "text-subtle hover:text-ink"
                }`}
              >
                {h === "All" ? "All Parliament" : h}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-border/60">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by MP Name or Constituency..."
              className="w-full h-9 pl-9 pr-3 rounded border border-border bg-white text-[12.5px] text-ink placeholder:text-muted focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full h-9 px-3 rounded border border-border bg-white text-[12.5px] text-ink focus:outline-none focus:border-navy"
            >
              <option value="All">Filter by State (All)</option>
              {statesList.filter((s) => s !== "All").map((s) => (
                <option key={s} value={s}>{s}</option>
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
              {partiesList.filter((p) => p !== "All").map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end text-[12px] font-semibold text-navy">
            Showing {filteredMps.length} of {mpDirectory.length} Members
          </div>
        </div>
      </div>

      {/* Directory Data Table */}
      <div className="bg-card border border-border rounded-[6px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-paper text-[11px] uppercase tracking-wider text-muted font-bold">
                <th className="px-4 py-3">Member of Parliament</th>
                <th className="px-4 py-3">House &amp; Party</th>
                <th className="px-4 py-3">Constituency / State</th>
                <th className="px-4 py-3">Sanctioned (₹)</th>
                <th className="px-4 py-3">Utilization %</th>
                <th className="px-4 py-3 text-center">Open Alerts</th>
                <th className="px-4 py-3">Risk Profile</th>
                <th className="px-4 py-3 text-right">Actions</th>
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
                    No Members of Parliament found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MP Detail Modal / Drawer */}
      {selectedMp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              {/* Performance Metrics */}
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
                  <div className="text-[11px] text-muted font-medium">Works Recommended</div>
                  <div className="text-lg font-bold text-ink">{selectedMp.recommendedCount} Works</div>
                </div>
              </div>

              {/* Sector Distribution */}
              <div className="bg-card border border-border rounded p-4">
                <h4 className="font-serif font-bold text-sm text-ink mb-3 flex items-center gap-1.5">
                  <PieChart size={15} className="text-navy" /> Sector Allocation Breakdown (%)
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

              {/* Sanctioned Works List */}
              <div>
                <h4 className="font-serif font-bold text-sm text-ink mb-2 flex items-center gap-1.5">
                  <HardHat size={15} className="text-navy" /> Recommended &amp; Executed Works
                </h4>
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-paper p-2.5 text-[11px] font-bold text-muted uppercase tracking-wider grid grid-cols-12 gap-2">
                    <span className="col-span-6">Work Description</span>
                    <span className="col-span-3">Cost</span>
                    <span className="col-span-3">Status</span>
                  </div>
                  <div className="divide-y divide-border text-[12px]">
                    {worksList
                      .filter((w) => w.mp === selectedMp.name || selectedMp.name.includes(w.mp.split(" ")[1]))
                      .concat(worksList.slice(0, 2))
                      .slice(0, 3)
                      .map((w, idx) => (
                        <div key={idx} className="p-2.5 grid grid-cols-12 gap-2 items-center hover:bg-paper/50">
                          <div className="col-span-6 font-medium text-ink truncate">{w.name}</div>
                          <div className="col-span-3 text-subtle font-bold">₹{w.cost} Lakhs</div>
                          <div className="col-span-3">
                            <StatusTag status={w.status === "Completed" ? "Closed" : w.status === "Ongoing" ? "Under review" : "Open"} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-paper px-6 py-3 border-t border-border flex items-center justify-between shrink-0">
              <span className="text-[11px] text-muted">Data source: MoSPI Public Registry</span>
              <button
                onClick={() => setSelectedMp(null)}
                className="bg-navy text-white px-4 py-1.5 rounded text-[12px] font-semibold hover:bg-navy-light"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

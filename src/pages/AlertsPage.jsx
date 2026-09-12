import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import RiskPill from "../components/RiskPill.jsx";
import StatusTag from "../components/StatusTag.jsx";
import AlertDrawer from "../components/AlertDrawer.jsx";
import { alerts } from "../data/mockData.js";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export default function AlertsPage() {
  const [riskFilter, setRiskFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchesRisk =
        riskFilter === "all" ||
        (riskFilter === "high" && a.risk >= 80) ||
        (riskFilter === "medium" && a.risk >= 60 && a.risk < 80) ||
        (riskFilter === "low" && a.risk < 60);
      const matchesQuery =
        query.trim() === "" ||
        a.work.toLowerCase().includes(query.toLowerCase()) ||
        a.mp.toLowerCase().includes(query.toLowerCase()) ||
        a.state.toLowerCase().includes(query.toLowerCase());
      return matchesRisk && matchesQuery;
    });
  }, [riskFilter, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by work, MP, or state"
            className="w-full h-9 pl-9 pr-3 rounded-[4px] border border-border bg-card text-[13px] text-ink placeholder:text-muted outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-1 bg-card border border-border rounded-[4px] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setRiskFilter(f.key)}
              className={
                "text-[12px] px-3 py-1.5 rounded-[6px] font-medium transition-colors " +
                (riskFilter === f.key ? "bg-ink text-white" : "text-subtle hover:bg-paper")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-[4px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-paper">
              {["Alert", "Work", "MP / State", "Type", "Amount", "Risk", "Status", ""].map((h) => (
                <th key={h} className="text-[11px] uppercase tracking-wide text-muted font-medium px-4 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr
                key={a.id}
                onClick={() => setSelected(a)}
                className={"cursor-pointer hover:bg-paper " + (i !== 0 ? "border-t border-[#DDE3EA]" : "")}
              >
                <td className="px-4 py-3 text-[12px] text-muted whitespace-nowrap">{a.id}</td>
                <td className="px-4 py-3 text-[13px] text-ink max-w-[220px] truncate">{a.work}</td>
                <td className="px-4 py-3 text-[12px] text-subtle whitespace-nowrap">
                  {a.mp} · {a.state}
                </td>
                <td className="px-4 py-3 text-[12px] text-subtle whitespace-nowrap">{a.type}</td>
                <td className="px-4 py-3 text-[13px] text-ink tabular-nums whitespace-nowrap">{a.amount}</td>
                <td className="px-4 py-3">
                  <RiskPill score={a.risk} />
                </td>
                <td className="px-4 py-3">
                  <StatusTag status={a.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight size={15} className="text-[#9AA9BA]" />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-muted">
                  No alerts match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <AlertDrawer alert={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

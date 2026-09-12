import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ label, value, sub, subTone, icon: Icon }) {
  return (
    <div className="bg-card border border-border rounded-[4px] p-4 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-subtle">{label}</span>
        <Icon size={16} className="text-muted" strokeWidth={1.75} />
      </div>
      <div className="font-serif text-[26px] leading-none text-ink tabular-nums">{value}</div>
      {sub && (
        <div
          className={
            "flex items-center gap-1 text-[12px] " +
            (subTone === "up" ? "text-[#A32A20]" : subTone === "down" ? "text-[#1F6B37]" : "text-subtle")
          }
        >
          {subTone === "up" && <TrendingUp size={13} strokeWidth={2} />}
          {subTone === "down" && <TrendingDown size={13} strokeWidth={2} />}
          {sub}
        </div>
      )}
    </div>
  );
}

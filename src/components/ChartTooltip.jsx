export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-ink text-white text-[12px] rounded-md px-3 py-2">
      <div className="text-[#B7C4D1] mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium tabular-nums">
            {typeof p.value === "number" && p.dataKey !== "flagged" ? `\u20b9${p.value}Cr` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

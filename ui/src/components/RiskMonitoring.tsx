const risks = [
  { project: "Rural road improvement", location: "Barpeta, Assam", risk: "High", signal: "Spend is 18% ahead of physical progress", color: "bg-[#b44a32]" },
  { project: "Community health centre", location: "Kozhikode, Kerala", risk: "Medium", signal: "Milestone due in 6 days", color: "bg-[#d19a38]" },
  { project: "Solar street lighting", location: "Dausa, Rajasthan", risk: "Medium", signal: "Vendor response pending", color: "bg-[#d19a38]" },
];

export function RiskMonitoring() {
  return (
    <section aria-labelledby="risk-title" className="border-t border-[var(--line)] pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Signal room</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight" id="risk-title">Risk monitoring</h2>
        </div>
        <span className="border border-[#b44a32]/30 bg-[#b44a32]/10 px-3 py-1.5 text-xs font-semibold text-[#b44a32]">14 projects need review</span>
      </div>
      <div className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {risks.map((item) => (
          <article className="grid gap-3 py-5 md:grid-cols-[1.2fr_0.8fr_auto] md:items-center" key={item.project}>
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
              <div>
                <h3 className="font-semibold">{item.project}</h3>
                <p className="mt-1 text-sm text-black/50">{item.location}</p>
              </div>
            </div>
            <p className="text-sm text-black/65">{item.signal}</p>
            <span className="text-sm font-bold">{item.risk} risk</span>
          </article>
        ))}
      </div>
    </section>
  );
}
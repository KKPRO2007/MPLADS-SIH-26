export default function RiskPill({ score }) {
  const tone =
    score >= 80
      ? { bg: "#DDF3E2", fg: "#176B35" }
      : score >= 60
      ? { bg: "#E7F6EA", fg: "#237A3B" }
      : { bg: "#F0FAF2", fg: "#39834D" };

  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-[12px] font-medium px-2.5 py-0.5 tabular-nums"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {score}
    </span>
  );
}

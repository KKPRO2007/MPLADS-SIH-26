export default function RiskPill({ score }) {
  const tone =
    score >= 80
      ? { bg: "#FBE4E1", fg: "#A32A20" }
      : score >= 60
      ? { bg: "#FDF0D9", fg: "#8A5F17" }
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

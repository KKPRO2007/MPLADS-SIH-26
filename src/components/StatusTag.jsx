const TONES = {
  Open: { bg: "#FBE4E1", fg: "#A32A20" },
  "Under review": { bg: "#FDF0D9", fg: "#8A5F17" },
  Escalated: { bg: "#EFE3F2", fg: "#5B3A6B" },
  Closed: { bg: "#E1F0E5", fg: "#1F6B37" },
};

export default function StatusTag({ status }) {
  const tone = TONES[status] || TONES.Open;
  return (
    <span
      className="inline-flex items-center rounded text-[12px] font-medium px-2 py-0.5 whitespace-nowrap"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {status}
    </span>
  );
}

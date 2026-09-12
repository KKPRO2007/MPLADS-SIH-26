import { AlertTriangle, Building2, Calendar, MapPin, Printer, User, X } from "lucide-react";

function parseCoordinates(value) {
  if (!value || value === "Not recorded") return false;
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  return match ? { latitude: Number(match[1]), longitude: Number(match[2]) } : null;
}

export default function WorkDetailsModal({ work, onClose }) {
  if (!work) return null;

  const cost = Number(work.cost) || 0;
  const disbursed = Number(work.disbursed) || 0;
  const disbursementPct = cost > 0 ? Math.round((disbursed / cost) * 100) : null;
  const coordinates = parseCoordinates(work.geoCoords);
  const mapUrl = coordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.longitude - 0.01},${coordinates.latitude - 0.01},${coordinates.longitude + 0.01},${coordinates.latitude + 0.01}&layer=mapnik&marker=${coordinates.latitude},${coordinates.longitude}`
    : "";
  const reviewRequired = Number(work.riskScore) >= 60;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/45 flex items-center justify-center p-3 sm:p-5 overflow-hidden overscroll-none">
      <div
        className="bg-[#F8FAFC] border border-slate-300 shadow-xl max-w-5xl w-full overflow-hidden overscroll-contain"
        style={{ height: "94vh", maxHeight: "94vh", display: "flex", flexDirection: "column" }}
      >
        <div
          className="bg-[#0B3768] text-white p-5 sm:p-6 border-b-4 border-saffron flex items-start justify-between gap-4"
          style={{ flex: "0 0 auto", backgroundColor: "#0B3768", color: "#FFFFFF" }}
        >
          <div className="min-w-0">
            <div className="text-[11px] text-slate-200 font-mono mb-1">{work.id}</div>
            <h3 className="font-bold text-xl sm:text-2xl leading-tight">{work.name}</h3>
            <p className="text-xs text-slate-200 mt-2 flex items-center gap-1.5 flex-wrap">
              <span>{work.sector}</span><span aria-hidden="true">·</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {work.district}, {work.state}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-white/80 hover:text-white border border-white/25" aria-label="Close work details"><X size={20} /></button>
        </div>

        <div
          className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 text-[#111827]"
          style={{ flex: "1 1 0%", minHeight: 0, color: "#111827", WebkitOverflowScrolling: "touch", scrollbarGutter: "stable" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 p-4"><div className="text-[11px] text-slate-500 font-bold uppercase">Sanctioned cost</div><div className="text-2xl font-bold text-[#0B3768] mt-2">INR {work.cost} <span className="text-sm font-medium">Lakhs</span></div></div>
            <div className="bg-white border border-slate-200 p-4"><div className="text-[11px] text-slate-500 font-bold uppercase">Disbursed amount</div><div className="text-2xl font-bold text-emerald-700 mt-2">INR {work.disbursed} <span className="text-sm font-medium">Lakhs</span></div><div className="text-[11px] text-slate-500 mt-1">{disbursementPct === null ? "Not calculated" : `${disbursementPct}% of sanctioned cost`}</div></div>
            <div className="bg-white border border-slate-200 p-4"><div className="text-[11px] text-slate-500 font-bold uppercase">Physical progress</div><div className="text-2xl font-bold text-slate-900 mt-2">{work.progressPct}%</div><div className="text-[11px] text-slate-500 mt-1">Status: {work.status || "Not recorded"}</div></div>
            <div className="bg-white border border-slate-200 p-4"><div className="text-[11px] text-slate-500 font-bold uppercase">Sanction date</div><div className="text-lg font-bold text-slate-900 mt-3">{work.sanctionDate || "Not recorded"}</div></div>
          </div>

          <div className="bg-white border border-slate-200 p-4 sm:p-5 text-[#111827]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3"><h4 className="text-sm font-bold text-[#0B3768]">Work verification details</h4><span className="text-xs text-slate-500">Review source records before action</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
              <div className="flex items-start gap-2"><User size={16} className="text-slate-500 mt-0.5" /><div><div className="text-xs text-slate-500">Recommending MP</div><strong>{work.mp || "Not recorded"}</strong></div></div>
              <div className="flex items-start gap-2"><Building2 size={16} className="text-slate-500 mt-0.5" /><div><div className="text-xs text-slate-500">Executing agency</div><strong>{work.agency || "Not recorded"}</strong></div></div>
              <div className="flex items-start gap-2"><Calendar size={16} className="text-slate-500 mt-0.5" /><div><div className="text-xs text-slate-500">Location</div><strong>{work.district}, {work.state}</strong></div></div>
              <div className="flex items-start gap-2"><MapPin size={16} className="text-slate-500 mt-0.5" /><div><div className="text-xs text-slate-500">Coordinates</div><strong>{work.geoCoords || "Not recorded"}</strong></div></div>
            </div>
          </div>

          {reviewRequired && <div className="bg-amber-50 border border-amber-300 p-4"><div className="flex items-center gap-2 text-amber-900 font-bold text-sm"><AlertTriangle size={17} /> Review signal</div><p className="text-sm text-amber-900 mt-2">The available data indicates this work needs document and field verification.</p><p className="text-xs text-amber-800 mt-1">Signal type: {work.flagType || "Risk threshold exceeded"}. This is not a finding of fraud.</p></div>}

          <div className="bg-white border border-slate-200 p-4 sm:p-5"><div className="flex items-center gap-2 border-b border-slate-200 pb-3"><MapPin size={17} className="text-[#0B3768]" /><h4 className="text-sm font-bold text-[#0B3768]">Work location</h4></div>{coordinates ? <iframe title={`Map for ${work.name}`} src={mapUrl} className="w-full h-64 mt-4 border-0" loading="lazy" /> : <div className="mt-4 min-h-32 border border-dashed border-slate-300 flex items-center justify-center text-center p-5"><p className="text-sm text-slate-500">A map will appear when verified latitude and longitude are available for this work.</p></div>}</div>
        </div>

        <div className="bg-white px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3" style={{ flex: "0 0 auto" }}><button type="button" onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 flex items-center gap-2"><Printer size={15} /> Print work summary</button><button type="button" onClick={onClose} className="bg-[#0B3768] hover:bg-[#082743] text-white text-xs font-bold px-6 py-2.5">Close</button></div>
      </div>
    </div>
  );
}

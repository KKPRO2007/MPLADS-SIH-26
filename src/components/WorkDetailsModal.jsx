import { Building2, Calendar, MapPin, Printer, User, X } from "lucide-react";
import { useEffect, useState } from "react";

function parseCoordinates(value) {
  if (!value || value === "Not recorded") return false;
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  return match ? { latitude: Number(match[1]), longitude: Number(match[2]) } : null;
}

function fallbackExplanation(work) {
  const reasons = [];
  if (work.flagType && work.flagType !== "None") reasons.push(`${work.flagType.replaceAll("_", " ")} signal`);
  if (Number(work.progressPct) < 50) reasons.push(`physical progress is ${work.progressPct}%`);
  if (work.status === "Delayed" || work.status === "Stalled") reasons.push(`the work is ${work.status.toLowerCase()}`);
  if (Number(work.cost) > 0 && Number(work.disbursed) < Number(work.cost)) reasons.push(`${Math.round((1 - Number(work.disbursed) / Number(work.cost)) * 100)}% of sanctioned cost remains undistributed`);
  return reasons.length > 0 ? `This project needs review because ${reasons.join(", ")}.` : "The project is included for routine model and field monitoring.";
}

export default function WorkDetailsModal({ work, onClose, user, onLogin }) {
  if (!work) return null;

  return <WorkDetailsContent work={work} onClose={onClose} user={user} onLogin={onLogin} />;
}

function WorkDetailsContent({ work, onClose, user, onLogin }) {
  const [prediction, setPrediction] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/ml-api/projects/${encodeURIComponent(work.id)}/risk`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then(setPrediction)
      .catch((error) => { if (error.name !== "AbortError") setPrediction(null); });
    return () => controller.abort();
  }, [work.id]);

  const cost = Number(work.cost) || 0;
  const disbursed = Number(work.disbursed) || 0;
  const disbursementPct = cost > 0 ? Math.round((disbursed / cost) * 100) : null;
  const coordinates = parseCoordinates(work.geoCoords);
  const mapUrl = coordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.longitude - 0.01},${coordinates.latitude - 0.01},${coordinates.longitude + 0.01},${coordinates.latitude + 0.01}&layer=mapnik&marker=${coordinates.latitude},${coordinates.longitude}`
    : "";
  const riskScore = prediction?.risk_score ?? Math.min(99.999, Math.max(20, Number(work.riskScore ?? 20)));
  const riskLevel = prediction?.risk_level || work.riskLevel || (riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low");
  const shapValues = prediction?.top_features || work.shapValues || [];
  const whyRisk = prediction?.why_flagged || work.why || fallbackExplanation(work);

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

          <div className="bg-white border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-[#0B3768]">Risk assessment</h4>
              <div className="flex items-center gap-2"><strong className="text-lg text-[#B23A32]">{riskScore}/100</strong><span className="text-xs font-bold px-2 py-1 bg-[#FBE4E1] text-[#A32A20] border border-[#E8B8B2]">{riskLevel}</span></div>
            </div>
            <p className="text-sm text-slate-700 mt-3">{whyRisk}</p>
            {prediction?.predicted_anomaly_type && <div className="mt-2 text-xs font-semibold text-slate-600">Anomaly type: {prediction.predicted_anomaly_type.replaceAll("_", " ")} · {(prediction.anomaly_type_confidence * 100).toFixed(1)}% confidence</div>}
            {shapValues.length > 0 && <div className="mt-4"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Top SHAP evidence</div><div className="flex flex-col gap-2">{shapValues.slice(0, 5).map((item) => <div key={item.feature} className="text-xs"><div className="flex justify-between gap-2"><span className="text-slate-600">{item.label || item.feature}</span><strong className={item.direction === "decreased" ? "text-emerald-700" : "text-[#B23A32]"}>{item.direction === "decreased" ? "↓" : "↑"} {Math.abs(Number(item.impact ?? item.value)).toFixed(3)}</strong></div><div className="h-1.5 bg-slate-100 mt-1"><div className={item.direction === "decreased" ? "h-full bg-emerald-600" : "h-full bg-[#B23A32]"} style={{ width: `${Math.min(100, Math.abs(Number(item.impact ?? item.value)) * 100)}%` }} /></div><div className="text-slate-500 mt-0.5">{item.detail || `${item.direction === "decreased" ? "Reduced" : "Increased"} risk contribution`}</div></div>)}</div></div>}
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

          {user && <div className="bg-white border border-slate-200 p-4 sm:p-5"><h4 className="text-sm font-bold text-[#0B3768]">Review processing</h4><p className="text-xs text-slate-500 mt-1">Send this project to the assigned review team.</p><button type="button" onClick={() => setReviewStatus("Sent to the review team for processing.")} className="mt-3 bg-[#0B3768] hover:bg-[#082743] text-white text-xs font-bold px-4 py-2">Send for review</button>{reviewStatus && <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-2.5">{reviewStatus}</div>}</div>}
          {!user && <div className="bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600">Sign in to send this project to the review team for processing. <button type="button" onClick={onLogin} className="font-bold text-[#0B3768] underline">Sign in</button></div>}
          <div className="bg-white border border-slate-200 p-4 sm:p-5"><div className="flex items-center gap-2 border-b border-slate-200 pb-3"><MapPin size={17} className="text-[#0B3768]" /><h4 className="text-sm font-bold text-[#0B3768]">Work location</h4></div>{coordinates ? <iframe title={`Map for ${work.name}`} src={mapUrl} className="w-full h-64 mt-4 border-0" loading="lazy" /> : <div className="mt-4 min-h-32 border border-dashed border-slate-300 flex items-center justify-center text-center p-5"><p className="text-sm text-slate-500">A map will appear when verified latitude and longitude are available for this work.</p></div>}</div>
        </div>

        <div className="bg-white px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3" style={{ flex: "0 0 auto" }}><button type="button" onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 flex items-center gap-2"><Printer size={15} /> Print work summary</button><button type="button" onClick={onClose} className="bg-[#0B3768] hover:bg-[#082743] text-white text-xs font-bold px-6 py-2.5">Close</button></div>
      </div>
    </div>
  );
}

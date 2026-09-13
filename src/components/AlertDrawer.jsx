import { X, FileWarning, ShieldAlert, CheckCircle, Send } from "lucide-react";
import RiskPill from "./RiskPill.jsx";
import StatusTag from "./StatusTag.jsx";
import { useState } from "react";

export default function AlertDrawer({ alert, onClose }) {
  const [actionDone, setActionDone] = useState(null);
  const [status, setStatus] = useState(alert.status);
  const shapValues = alert.shapValues || [];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[460px] h-full bg-white p-6 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-border">
            <div>
              <div className="text-[11px] font-mono text-saffron font-bold uppercase tracking-wider">{alert.id} &middot; Red Flag Audit</div>
              <h2 className="font-serif text-[18px] text-ink font-bold leading-snug pr-4 mt-0.5">{alert.work}</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded text-muted hover:text-ink hover:bg-paper" aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <RiskPill score={alert.risk} />
            <span className="text-[12px] text-subtle font-medium">{alert.riskLevel || (alert.risk >= 80 ? "High" : alert.risk >= 60 ? "Medium" : "Low")} risk</span>
            <span className="mx-1 text-[#D8D4C6]">&middot;</span>
            <StatusTag status={status} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-paper rounded border border-border p-3">
              <div className="text-[11px] text-muted font-medium mb-1">Member of Parliament</div>
              <div className="text-[13px] text-ink font-bold">{alert.mp}</div>
            </div>
            <div className="bg-paper rounded border border-border p-3">
              <div className="text-[11px] text-muted font-medium mb-1">State Jurisdiction</div>
              <div className="text-[13px] text-ink font-bold">{alert.state}</div>
            </div>
            <div className="bg-paper rounded border border-border p-3">
              <div className="text-[11px] text-muted font-medium mb-1">Disbursed Amount</div>
              <div className="text-[13px] text-navy font-bold tabular-nums">{alert.amount}</div>
            </div>
            <div className="bg-paper rounded border border-border p-3">
              <div className="text-[11px] text-muted font-medium mb-1">Flagged Date</div>
              <div className="text-[13px] text-ink font-bold">{alert.flaggedOn}</div>
            </div>
          </div>

          <div className="mb-5 bg-[#F2FBF4] border border-[#CDE8D3] p-4 rounded">
            <div className="text-[12px] font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
              <FileWarning size={15} /> Why this work was flagged
            </div>
            <p className="text-[12.5px] text-text leading-relaxed mb-2 font-medium">
              {alert.why || alert.details || "The persisted ML score exceeded the review threshold."}
            </p>
            {shapValues.length > 0 && <div className="mt-3 border-t border-[#CDE8D3] pt-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted mb-2">SHAP-aligned feature contribution</div>
              <div className="flex flex-col gap-2">
                {shapValues.filter((item) => item.value > 0).map((item) => (
                  <div key={item.feature} className="text-[11px]">
                    <div className="flex justify-between gap-2"><span className="text-subtle">{item.feature}</span><strong className="text-ink">+{item.value}</strong></div>
                    <div className="h-1.5 bg-[#DCEFE0] mt-1"><div className="h-full bg-emerald-600" style={{ width: `${Math.min(100, Number(item.value) * 4)}%` }} /></div>
                    <div className="text-muted mt-0.5">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>}
          </div>

          {alert.recommendation && (
            <div className="mb-5 bg-navy/5 border border-navy/15 p-3.5 rounded text-[12px]">
              <span className="font-bold text-navy block mb-1">Recommended Administrative Action:</span>
              <p className="text-subtle">{alert.recommendation}</p>
            </div>
          )}

          {actionDone && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded text-[12px] font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={16} /> {actionDone}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => { setStatus("Escalated"); setActionDone("Official notice issued to the district nodal agency."); }}
            className="flex-1 h-9 rounded bg-[#B23A32] hover:bg-[#8D2B24] text-white text-[12.5px] font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldAlert size={14} /> Issue DM Inquiry
          </button>
          <button
            onClick={() => { setStatus("Closed"); setActionDone("Alert marked as reviewed."); }}
            className="flex-1 h-9 rounded border border-border text-ink text-[12.5px] font-semibold hover:bg-paper transition-colors"
          >
            Mark Reviewed
          </button>
        </div>
      </div>
    </div>
  );
}

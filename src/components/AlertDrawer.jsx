import { X, FileWarning, ShieldAlert, CheckCircle, Send } from "lucide-react";
import RiskPill from "./RiskPill.jsx";
import StatusTag from "./StatusTag.jsx";
import { useState } from "react";

export default function AlertDrawer({ alert, onClose }) {
  const [actionDone, setActionDone] = useState(null);
  const reasons = alert.signals || [alert.details || "The persisted ML score exceeded the review threshold."];

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
            <span className="text-[12px] text-subtle font-medium">AI Risk Rating</span>
            <span className="mx-1 text-[#D8D4C6]">&middot;</span>
            <StatusTag status={alert.status} />
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

          <div className="mb-5 bg-[#FFF9F2] border border-[#F5E6CC] p-4 rounded">
            <div className="text-[12px] font-bold text-accent mb-2 flex items-center gap-1.5">
              <FileWarning size={15} /> AI Detection Rationale
            </div>
            <p className="text-[12.5px] text-text leading-relaxed mb-2 font-medium">
              {alert.details || "Discrepancy detected between sanctioned cost estimates and average district benchmark."}
            </p>
            <ul className="flex flex-col gap-1.5 mt-2">
              {reasons.map((r, i) => (
                <li key={i} className="text-[12px] text-subtle leading-relaxed pl-2 border-l-2 border-saffron">
                  {r}
                </li>
              ))}
            </ul>
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
            onClick={() => setActionDone("Official Notice Issued to District Collector Nodal Agency.")}
            className="flex-1 h-9 rounded bg-[#B23A32] hover:bg-[#8D2B24] text-white text-[12.5px] font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldAlert size={14} /> Issue DM Inquiry
          </button>
          <button
            onClick={() => setActionDone("Alert marked as reviewed and logged in MoSPI Audit Journal.")}
            className="flex-1 h-9 rounded border border-border text-ink text-[12.5px] font-semibold hover:bg-paper transition-colors"
          >
            Mark Reviewed
          </button>
        </div>
      </div>
    </div>
  );
}

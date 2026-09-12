import { useState } from "react";
import { Send, FileText, CheckCircle2, Download, Printer, Landmark, Sparkles } from "lucide-react";
import { mpDirectory, stateRisk, sectorAllocations } from "../data/mockData.js";

export default function CitizenCornerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "Uttar Pradesh",
    constituency: "Meerut",
    sector: "Drinking Water & Harvesting",
    description: "",
  });

  const [selectedReportMp, setSelectedReportMp] = useState(mpDirectory[0]);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
        <h2 className="font-serif font-bold text-lg text-ink">
          Citizen Corner &amp; Constituency Transparency Portal
        </h2>
        <p className="text-[12px] text-muted">
          Citizens can directly suggest community works to their Member of Parliament and generate official MPLADS expenditure reports for their constituency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recommend a Work Form */}
        <div className="bg-card border border-border rounded-[6px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-saffron" />
              <h3 className="font-serif font-bold text-base text-ink">
                Recommend a Work in Your Constituency
              </h3>
            </div>
            <p className="text-[12px] text-muted mb-4">
              Under MPLADS guidelines, citizens and resident welfare associations may submit public utility work recommendations to their respective MPs for consideration.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded-[6px] text-center flex flex-col items-center gap-2">
                <CheckCircle2 size={36} className="text-green-600" />
                <h4 className="font-bold text-base">Suggestion Submitted Successfully!</h4>
                <p className="text-[12px] text-green-700 max-w-md">
                  Your work recommendation reference <strong>#CIT-2026-8912</strong> has been logged in the District Nodal Registry and forwarded to the office of <strong>{form.constituency} MP</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ ...form, description: "" });
                  }}
                  className="mt-3 bg-navy text-white px-4 py-1.5 rounded text-[12px] font-semibold"
                >
                  Submit Another Recommendation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-[12.5px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-ink mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-ink mb-1">Mobile / Email *</label>
                    <input
                      type="text"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-ink mb-1">State / UT</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                    >
                      {stateRisk.map((s) => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-ink mb-1">Constituency</label>
                    <input
                      type="text"
                      value={form.constituency}
                      onChange={(e) => setForm({ ...form, constituency: e.target.value })}
                      placeholder="e.g. Meerut"
                      className="w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink mb-1">Sector Category</label>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                  >
                    {sectorAllocations.map((sec) => (
                      <option key={sec.key} value={sec.sector}>{sec.sector}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink mb-1">Work Description &amp; Location Details *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the requested work (e.g., Installation of solar streetlights near Community Health Center, Ward 12)..."
                    className="w-full p-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-navy hover:bg-navy-light text-white font-bold py-2.5 px-4 rounded text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors mt-1"
                >
                  <Send size={15} /> Submit Work Recommendation
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Constituency Report Card Generator */}
        <div className="bg-card border border-border rounded-[6px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-navy" />
              <h3 className="font-serif font-bold text-base text-ink">
                Constituency Report Generator
              </h3>
            </div>
            <p className="text-[12px] text-muted mb-4">
              Select any Member of Parliament to generate and print an official Citizens' Audit &amp; Performance Summary Report.
            </p>

            <div className="flex flex-col gap-3 bg-paper p-4 rounded border border-border">
              <div>
                <label className="block font-bold text-ink mb-1 text-[12px]">Select Member of Parliament:</label>
                <select
                  value={selectedReportMp.name}
                  onChange={(e) => {
                    const found = mpDirectory.find((m) => m.name === e.target.value);
                    if (found) setSelectedReportMp(found);
                  }}
                  className="w-full h-9 px-3 rounded border border-border bg-white text-[13px] text-ink font-medium focus:outline-none focus:border-navy"
                >
                  {mpDirectory.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.constituency}, {m.state}) - {m.house}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-3 rounded border border-border text-[12px] space-y-1.5">
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted">Constituency:</span>
                  <strong className="text-ink">{selectedReportMp.constituency} ({selectedReportMp.state})</strong>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted">House &amp; Party:</span>
                  <strong className="text-ink">{selectedReportMp.house} &middot; {selectedReportMp.party}</strong>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted">Sanctioned Amount:</span>
                  <strong className="text-navy">₹{selectedReportMp.sanctioned} Cr</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Utilization Rate:</span>
                  <strong className="text-green-700">{selectedReportMp.utilizationPct}%</strong>
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="bg-accent hover:bg-accent/90 text-white font-bold py-2.5 px-4 rounded text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors mt-2"
              >
                <Printer size={15} /> Generate Printable Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="bg-[#0B3B60] text-white p-6 border-b-4 border-saffron flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Landmark size={28} className="text-saffron" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Government of India &middot; MoSPI
                  </h3>
                  <div className="text-[11px] text-[#C5D7E8]">
                    MPLADS Constituency Performance &amp; Audit Card
                  </div>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-white/80 hover:text-white font-bold text-sm bg-white/10 px-3 py-1 rounded">
                Close
              </button>
            </div>

            <div className="p-6 text-[12.5px] text-ink space-y-4">
              <div className="border-b border-border pb-3 flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-bold text-xl text-navy">{selectedReportMp.name}</h4>
                  <p className="text-subtle font-medium">{selectedReportMp.constituency}, {selectedReportMp.state} ({selectedReportMp.house})</p>
                </div>
                <div className="text-right">
                  <span className="bg-saffron/20 text-accent font-bold px-2.5 py-1 rounded border border-saffron/40 text-[11px]">
                    Official Audit Certificate
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-paper p-3 rounded border border-border text-center">
                <div>
                  <div className="text-[11px] text-muted">Sanctioned</div>
                  <div className="font-bold text-navy text-base">₹{selectedReportMp.sanctioned} Cr</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted font-bold">Utilized</div>
                  <div className="font-bold text-green-700 text-base">₹{selectedReportMp.utilized} Cr</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted">Utilization Rate</div>
                  <div className="font-bold text-ink text-base">{selectedReportMp.utilizationPct}%</div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-ink mb-1">Key Achievements &amp; Works Summary</h5>
                <ul className="list-disc list-inside text-subtle space-y-1">
                  <li>Total Works Recommended: {selectedReportMp.recommendedCount} Community Assets</li>
                  <li>Total Works Completed: {selectedReportMp.completedCount} Projects</li>
                  <li>Sector Focus: Drinking Water &amp; Infrastructure</li>
                </ul>
              </div>

              <div className="text-[10px] text-muted border-t border-border pt-3">
                This document is generated from the MPLADS AI-powered monitoring system.
              </div>
            </div>

            <div className="bg-paper px-6 py-3 border-t border-border flex justify-between">
              <button onClick={() => window.print()} className="bg-navy text-white px-4 py-1.5 rounded text-[12px] font-bold flex items-center gap-1.5">
                <Printer size={14} /> Print Report
              </button>
              <button onClick={() => setShowReportModal(false)} className="bg-gray-200 text-ink px-4 py-1.5 rounded text-[12px] font-bold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

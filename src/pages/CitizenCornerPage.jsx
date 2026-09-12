import { useState } from "react";
import { CheckCircle2, FileText, Info, Send, Sparkles } from "lucide-react";

export default function CitizenCornerPage({ data }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    state: "",
    constituency: "",
    sector: "",
    description: "",
  });
  const reportMps = data?.mps || [];
  const [selectedReportId, setSelectedReportId] = useState("");
  const selectedReportMp = reportMps.find((mp) => mp.id === selectedReportId);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.contact || !form.state || !form.constituency || !form.description) return;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-[6px] p-4 shadow-xs">
        <h2 className="font-serif font-bold text-lg text-ink">Citizen Corner &amp; Constituency Transparency Portal</h2>
        <p className="text-[12px] text-muted">
          Share a public-utility work idea or review constituency information when verified records are available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-[6px] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-saffron" />
            <h3 className="font-serif font-bold text-base text-ink">Recommend a Work in Your Constituency</h3>
          </div>
          <p className="text-[12px] text-muted mb-4">
            Add enough detail for the concerned office to understand the public need, location, and expected benefit.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded-[6px] text-center flex flex-col items-center gap-2">
              <CheckCircle2 size={36} className="text-green-600" />
              <h4 className="font-bold text-base">Recommendation details captured</h4>
              <p className="text-[12px] text-green-700 max-w-md">
                This prototype has recorded the form locally. Official submission requires connection to the District Nodal Registry.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 bg-navy text-white px-4 py-1.5 rounded text-[12px] font-semibold"
              >
                Edit Recommendation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-[12.5px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="font-semibold text-ink">
                  Your Full Name *
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Enter your name"
                    className="mt-1 w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                  />
                </label>
                <label className="font-semibold text-ink">
                  Mobile or Email *
                  <input
                    type="text"
                    required
                    value={form.contact}
                    onChange={(event) => updateField("contact", event.target.value)}
                    placeholder="How can the office contact you?"
                    className="mt-1 w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="font-semibold text-ink">
                  State / UT *
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    placeholder="Enter state or Union Territory"
                    className="mt-1 w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                  />
                </label>
                <label className="font-semibold text-ink">
                  Constituency *
                  <input
                    type="text"
                    required
                    value={form.constituency}
                    onChange={(event) => updateField("constituency", event.target.value)}
                    placeholder="Enter constituency"
                    className="mt-1 w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                  />
                </label>
              </div>

              <label className="font-semibold text-ink">
                Sector Category
                <input
                  type="text"
                  value={form.sector}
                  onChange={(event) => updateField("sector", event.target.value)}
                  placeholder="For example: water, roads, health, or education"
                  className="mt-1 w-full h-9 px-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                />
              </label>

              <label className="font-semibold text-ink">
                Work Description and Location Details *
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="What is needed, where should it be built, and who will benefit?"
                  className="mt-1 w-full p-3 rounded border border-border bg-paper text-ink focus:outline-none focus:border-navy"
                />
              </label>

              <p className="text-[11px] text-muted">
                Clear location and beneficiary details help authorities assess eligibility, urgency, and feasibility.
              </p>
              <button
                type="submit"
                className="bg-navy hover:bg-navy-light text-white font-bold py-2.5 px-4 rounded text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors mt-1"
              >
                <Send size={15} /> Submit Work Recommendation
              </button>
            </form>
          )}
        </div>

        <div className="bg-card border border-border rounded-[6px] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-navy" />
            <h3 className="font-serif font-bold text-base text-ink">Constituency Report Generator</h3>
          </div>
          <p className="text-[12px] text-muted mb-4">
            Generate a report only from verified MP and constituency records supplied by the monitoring database.
          </p>

          {reportMps.length === 0 ? (
            <div className="bg-paper border border-border rounded p-5 text-center" role="status">
              <Info size={24} className="mx-auto text-muted mb-2" />
              <h4 className="font-bold text-ink text-sm">No official MP records are loaded</h4>
              <p className="text-[12px] text-muted mt-2">
                Connect the verified PostgreSQL dataset to add an MP, constituency, sanctioned amount, utilization, and work summary before generating a report.
              </p>
              <button
                type="button"
                disabled
                className="mt-4 w-full bg-gray-200 text-muted font-bold py-2.5 px-4 rounded text-[13px] cursor-not-allowed"
              >
                Report unavailable until records load
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 bg-paper p-4 rounded border border-border">
              <label className="font-bold text-ink text-[12px]">
                Select Member of Parliament
                <select
                  value={selectedReportId}
                  onChange={(event) => setSelectedReportId(event.target.value)}
                  className="mt-1 w-full h-9 px-3 rounded border border-border bg-white text-[13px] text-ink font-medium focus:outline-none focus:border-navy"
                >
                  <option value="">Choose an MP record</option>
                  {reportMps.map((mp) => (
                    <option key={mp.id} value={mp.id}>{mp.name} ({mp.constituency}, {mp.state})</option>
                  ))}
                </select>
              </label>
              {selectedReportMp ? (
                <div className="bg-white p-3 rounded border border-border text-[12px] space-y-1.5">
                  <div className="flex justify-between"><span className="text-muted">Constituency:</span><strong>{selectedReportMp.constituency}, {selectedReportMp.state}</strong></div>
                  <div className="flex justify-between"><span className="text-muted">Sanctioned Amount:</span><strong className="text-navy">INR {selectedReportMp.sanctioned} Cr</strong></div>
                  <div className="flex justify-between"><span className="text-muted">Utilization Rate:</span><strong className="text-green-700">{selectedReportMp.utilizationPct}%</strong></div>
                </div>
              ) : (
                <p className="text-[12px] text-muted">Choose a verified MP record to review its available figures.</p>
              )}
              <button
                type="button"
                disabled={!selectedReportMp}
                className="bg-accent hover:bg-accent/90 disabled:bg-gray-200 disabled:text-muted text-white font-bold py-2.5 px-4 rounded text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors mt-2"
              >
                Generate Printable Audit Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

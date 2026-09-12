import { useState } from "react";
import {
  X,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  HardHat,
  Printer,
  FileCheck2,
  TrendingUp,
  Activity,
  AlertTriangle,
  Camera,
  Layers,
  ExternalLink,
  Download,
  Award,
  Globe,
  Compass,
  FileText,
  Navigation
} from "lucide-react";

export default function WorkDetailsModal({ work, onClose }) {
  const [activePhotoTab, setActivePhotoTab] = useState(0);

  if (!work) return null;

  const disbursementPct = ((work.disbursed / work.cost) * 100).toFixed(1);
  const isHighRisk = work.riskScore > 60;

  // Sample Geo-Tagged Field Inspection Photographs
  const fieldPhotos = [
    {
      title: "RCC Pillars & Foundation Execution",
      date: "28 Aug 2026",
      coords: work.geoCoords || "28.9845° N, 77.7064° E",
      inspector: "JE (Civil) Meerut Circle",
      type: "Structural Inspection",
      status: "Geo-Verified",
      bgGradient: "from-slate-800 via-slate-700 to-slate-900",
    },
    {
      title: "Boundary Wall & Site Layout",
      date: "12 Jul 2026",
      coords: work.geoCoords || "28.9845° N, 77.7064° E",
      inspector: "District Nodal Inspector",
      type: "Initial Groundwork",
      status: "Verified",
      bgGradient: "from-blue-950 via-slate-800 to-slate-900",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
      <div className="bg-[#F8FAFC] rounded-2xl border border-white/20 shadow-2xl max-w-5xl lg:max-w-6xl w-full max-h-[94vh] overflow-y-auto flex flex-col transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================== */}
        {/* HEADER BANNER - DARK RICH GOVERNMENT TECH  */}
        {/* ========================================== */}
        <div className="bg-gradient-to-r from-[#05182B] via-[#092B4E] to-[#041628] text-white p-6 sm:p-7 border-b border-cyan/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-lg">
          
          <div className="space-y-2 min-w-0">
            {/* Top Tag Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-cyan/15 text-cyan border border-cyan/40 px-3 py-1 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
                <Navigation size={12} className="text-cyan animate-pulse" />
                {work.id}
              </span>

              <span className="bg-saffron/15 text-saffron border border-saffron/40 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award size={13} /> District Collector Sanction
              </span>

              {isHighRisk && (
                <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                  <AlertTriangle size={13} className="text-red-400" /> AI High Risk ({work.riskScore}/100)
                </span>
              )}
            </div>

            {/* Work Title */}
            <h3 className="font-extrabold text-2xl sm:text-3xl text-white leading-tight tracking-tight">
              {work.name}
            </h3>

            {/* Meta Context */}
            <p className="text-xs sm:text-sm text-cyan-100/80 flex items-center gap-2 flex-wrap font-medium">
              <span className="bg-white/10 text-white px-2 py-0.5 rounded">{work.sector}</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1 text-slate-200">
                <MapPin size={14} className="text-red-400" />
                {work.district}, {work.state}
              </span>
            </p>
          </div>

          {/* Close Action */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 text-white/70 hover:text-white hover:bg-white/15 rounded-xl transition-all shrink-0 border border-white/10 hover:border-white/20 self-start sm:self-auto"
            title="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* ========================================== */}
        {/* MODAL BODY CONTAINER                      */}
        {/* ========================================== */}
        <div className="p-5 sm:p-7 space-y-6 text-slate-800">

          {/* ========================================== */}
          {/* SECTION 1: 4 HERO METRIC STAT CARDS        */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Sanctioned Cost */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-navy" />
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Sanctioned Cost</span>
                <div className="p-2 bg-navy/10 text-navy rounded-lg group-hover:scale-110 transition-transform">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
                ₹{work.cost} <span className="text-sm font-semibold text-slate-600">Lakhs</span>
              </div>
              <div className="text-[11.5px] text-slate-500 font-medium mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Approved Budget</span>
                <span className="font-bold text-navy">Collector Order</span>
              </div>
            </div>

            {/* Card 2: Disbursed Funds */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-600" />
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Disbursed Funds</span>
                <div className="p-2 bg-green-100 text-green-700 rounded-lg group-hover:scale-110 transition-transform">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-green-700 tracking-tight">
                ₹{work.disbursed} <span className="text-sm font-semibold text-slate-600">Lakhs</span>
              </div>
              <div className="text-[11.5px] text-slate-500 font-medium mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Release Velocity</span>
                <span className="font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  {disbursementPct}% Released
                </span>
              </div>
            </div>

            {/* Card 3: Physical Progress */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan" />
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Physical Progress</span>
                <div className="p-2 bg-cyan/15 text-navy rounded-lg group-hover:scale-110 transition-transform">
                  <Activity size={18} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {work.progressPct}%
                </span>
                <span className="text-xs font-bold text-cyan uppercase tracking-wider">
                  {work.status}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-cyan to-navy rounded-full transition-all duration-500"
                  style={{ width: `${work.progressPct}%` }}
                />
              </div>
            </div>

            {/* Card 4: Sanction Date */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-saffron" />
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Sanction Date</span>
                <div className="p-2 bg-saffron/15 text-saffron-dark rounded-lg group-hover:scale-110 transition-transform">
                  <Calendar size={18} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate tracking-tight">
                {work.sanctionDate}
              </div>
              <div className="text-[11.5px] text-slate-500 font-medium mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Official Record</span>
                <span className="font-mono text-slate-700 font-bold">DM/ML-582</span>
              </div>
            </div>

          </div>

          {/* ========================================== */}
          {/* SECTION 2: 5-STAGE PHYSICAL LIFECYCLE     */}
          {/* ========================================== */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy flex items-center gap-2">
                <FileCheck2 size={16} className="text-cyan" /> Multi-Stage Asset Lifecycle &amp; Verification Milestone
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Current Stage: <strong className="text-navy font-bold">Civil Execution (Stage 4)</strong>
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {/* Stage 1: Recommended */}
              <div className="bg-green-50/70 p-3.5 rounded-lg border border-green-200 text-green-900 flex flex-col items-center text-center relative shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs mb-1.5 shadow-xs">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-xs font-bold">1. Recommended</span>
                <span className="text-[10.5px] text-green-700 font-medium mt-0.5">MP Request Logged</span>
              </div>

              {/* Stage 2: Sanctioned */}
              <div className="bg-green-50/70 p-3.5 rounded-lg border border-green-200 text-green-900 flex flex-col items-center text-center relative shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs mb-1.5 shadow-xs">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-xs font-bold">2. DM Sanction</span>
                <span className="text-[10.5px] text-green-700 font-medium mt-0.5">Order Issued</span>
              </div>

              {/* Stage 3: Disbursed */}
              <div className="bg-green-50/70 p-3.5 rounded-lg border border-green-200 text-green-900 flex flex-col items-center text-center relative shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs mb-1.5 shadow-xs">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-xs font-bold">3. Fund Transfer</span>
                <span className="text-[10.5px] text-green-700 font-medium mt-0.5">₹{work.disbursed}L Disbursed</span>
              </div>

              {/* Stage 4: On-Site Work */}
              <div className="bg-cyan/10 p-3.5 rounded-lg border-2 border-cyan text-navy flex flex-col items-center text-center relative shadow-xs ring-2 ring-cyan/20">
                <div className="w-8 h-8 rounded-full bg-navy text-cyan flex items-center justify-center font-bold text-xs mb-1.5 shadow-xs animate-bounce">
                  <Activity size={18} />
                </div>
                <span className="text-xs font-extrabold text-navy">4. On-Site Civil</span>
                <span className="text-[11px] text-cyan-700 font-extrabold mt-0.5 bg-cyan/20 px-2 py-0.5 rounded">
                  {work.progressPct}% Active
                </span>
              </div>

              {/* Stage 5: Geo Audit */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-400 flex flex-col items-center text-center relative opacity-70">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs mb-1.5">
                  <Camera size={16} />
                </div>
                <span className="text-xs font-bold text-slate-600">5. Geo Audit</span>
                <span className="text-[10.5px] text-slate-400 font-medium mt-0.5">Final Completion</span>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* SECTION 3: AI RISK FLAG DETAILED ANALYSIS  */}
          {/* ========================================== */}
          {work.riskScore > 50 && (
            <div className="bg-gradient-to-r from-red-950 via-red-900 to-slate-950 text-white rounded-xl p-5 sm:p-6 border border-red-500/40 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
                <ShieldAlert size={180} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-red-500 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <ShieldAlert size={14} /> AI Anomaly Detection Signal
                    </span>
                    <span className="bg-white/10 text-red-200 font-mono text-xs px-2.5 py-0.5 rounded border border-white/15">
                      Risk Score: {work.riskScore}/100
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    Flag Type: <span className="text-red-300">{work.flagType || "Cost & Timeline Anomaly"}</span>
                  </h4>

                  <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
                    Explainable AI analysis identified a financial disbursement velocity of <strong className="text-white">72.9% (₹{work.disbursed} Lakhs)</strong> while recorded physical site execution remains at <strong className="text-white font-bold">{work.progressPct}%</strong>. A potential discrepancy of 27.9% requires line-item audit by District Collectorate.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => alert(`Field Audit Triggered for ${work.id}. Notification sent to District Collector Meerut.`)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 border border-red-400/40"
                  >
                    <ShieldAlert size={15} /> Trigger Field Audit
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`AI Breakdown Report generated for ${work.id}`)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all border border-white/20 flex items-center justify-center gap-2"
                  >
                    <FileText size={15} /> AI Audit Breakdown
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 4: VISUAL STAKEHOLDERS & SATELLITE */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Stakeholders & Authority Matrix (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy flex items-center gap-2 border-b border-slate-100 pb-3">
                  <User size={16} className="text-cyan" /> Stakeholders &amp; Implementation Matrix
                </h4>
                
                <div className="space-y-3 mt-4 text-xs">
                  {/* MP */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Recommending MP</span>
                      <strong className="text-slate-900 text-sm">{work.mp}</strong>
                      <span className="text-slate-500 block text-[11px]">{work.state}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-navy text-saffron font-bold text-xs flex items-center justify-center border border-navy-light">
                      RC
                    </div>
                  </div>

                  {/* Executing Agency */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Executing Agency</span>
                      <strong className="text-navy text-xs sm:text-sm flex items-center gap-1.5">
                        <HardHat size={14} className="text-navy" /> {work.agency}
                      </strong>
                    </div>
                    <span className="bg-navy/10 text-navy font-bold text-[10px] px-2 py-1 rounded uppercase">
                      PWD Civil
                    </span>
                  </div>

                  {/* Nodal Authority */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Sanctioning Nodal Office</span>
                      <strong className="text-slate-900 text-xs">District Collectorate ({work.district})</strong>
                    </div>
                    <Building2 size={16} className="text-slate-400" />
                  </div>

                  {/* Coordinates */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Geo Coordinates</span>
                      <strong className="font-mono text-navy text-xs">{work.geoCoords}</strong>
                    </div>
                    <MapPin size={16} className="text-red-500" />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>Verified by eSAKSHI Portal</span>
                <span className="font-semibold text-navy">MoSPI Monitoring Standard</span>
              </div>
            </div>

            {/* Right Column: Live Geo Radar & Satellite Evidence (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-lg">
              
              {/* Top Radar Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-cyan animate-spin" style={{ animationDuration: '10s' }} />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan">
                    Geo-Tagged Satellite Radar &amp; Site Evidence
                  </h4>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Satellite Link
                </span>
              </div>

              {/* Simulated Visual Satellite Map Box */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-4 relative overflow-hidden min-h-[170px] flex flex-col justify-between">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
                
                {/* Radar Sweep Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/5 to-transparent pointer-events-none animate-pulse" />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="bg-slate-900/90 backdrop-blur border border-slate-700/70 p-2.5 rounded-lg text-xs space-y-0.5">
                    <div className="text-slate-400 text-[10.5px]">TARGET LOCATION:</div>
                    <div className="font-mono font-bold text-cyan text-sm">{work.geoCoords}</div>
                    <div className="text-[11px] text-slate-300">{work.name}</div>
                  </div>

                  <span className="bg-cyan/15 text-cyan text-[10px] font-mono font-bold px-2 py-1 rounded border border-cyan/30">
                    ACCURACY: &lt; 3.2m
                  </span>
                </div>

                {/* Center Radar Target Pin */}
                <div className="relative z-10 flex flex-col items-center justify-center my-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border border-cyan/40 animate-ping absolute" />
                    <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 border border-red-500 flex items-center justify-center shadow-lg">
                      <MapPin size={22} className="text-red-500" />
                    </div>
                  </div>
                  <div className="bg-slate-900/90 text-slate-300 font-mono text-[10.5px] px-2.5 py-0.5 rounded-full border border-slate-700 mt-2">
                    WARD 14 SITE BOUNDARY
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Compass size={13} className="text-cyan" /> Field Surveyor Audit #4812
                  </span>
                  <span className="text-cyan font-bold hover:underline cursor-pointer flex items-center gap-1">
                    Open GIS Explorer <ExternalLink size={12} />
                  </span>
                </div>
              </div>

              {/* Photo Evidence Gallery Cards */}
              <div className="mt-4 space-y-2">
                <div className="text-[11.5px] font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera size={14} className="text-cyan" /> Field Inspection Photo Records (2 Uploaded)
                  </span>
                  <span className="text-[10.5px] text-slate-400">Timestamped &amp; Verified</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {fieldPhotos.map((photo, idx) => (
                    <div
                      key={photo.title}
                      onClick={() => setActivePhotoTab(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                        activePhotoTab === idx
                          ? "bg-slate-900 border-cyan text-white shadow-md"
                          : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${photo.bgGradient} flex items-center justify-center shrink-0 border border-white/10 text-cyan`}>
                        <Camera size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{photo.title}</div>
                        <div className="text-[10.5px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{photo.date}</span>
                          <span>&middot;</span>
                          <span className="text-emerald-400 font-semibold">{photo.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* MODAL FOOTER - ACTIONS & CONTROLS          */}
        {/* ========================================== */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20 shadow-inner">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs"
            >
              <Printer size={15} /> Print Work Summary Brief
            </button>
            <button
              type="button"
              onClick={() => alert(`Downloading Geo-Audit Package for ${work.id}`)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-navy text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all hidden sm:flex"
            >
              <Download size={15} /> Export Geo-Audit Package
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-navy hover:bg-navy-dark text-white text-xs font-bold px-7 py-2.5 rounded-xl transition-all shadow-md border border-navy-light/40"
          >
            Close Inspection Window
          </button>
        </div>

      </div>
    </div>
  );
}


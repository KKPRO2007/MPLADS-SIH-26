import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bot,
  FileText,
  MapPinned,
  Menu,
  Search,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const workflow = [
  {
    title: "National & State Overview",
    text: "Real-time visibility into ₹12,000+ Cr sanctioned funds, MP-wise performance directory, and district-level work progress across all Indian states.",
    icon: BarChart3
  },
  {
    title: "AI Risk & Anomaly Oversight",
    text: "Automated screening for project delays, cost mismatches, geo-location anomalies, and unutilized balances with explainable risk scores.",
    icon: BadgeCheck
  },
  {
    title: "Asset & Work Verification",
    text: "Milestone verification, photographic evidence tracking, and transparent progress reports for MPs, District Nodal Authorities, and MoSPI.",
    icon: Activity
  }
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function HomePage({ onNavigate }) {
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    // A home-page visit should always start at the hero instead of retaining
    // the scroll location from the previous view.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const controller = new AbortController();
    fetch("/api/dashboard", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Dashboard API is unavailable");
        return response.json();
      })
      .then((data) => setDashboard(data))
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError("Waiting for the PostgreSQL data service.");
      });

    return () => controller.abort();
  }, []);

  const updatedAt = useMemo(
    () => dashboard?.generatedAt
      ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(dashboard.generatedAt))
      : "Awaiting backend data",
    [dashboard?.generatedAt]
  );

  const formatStat = (stat) => stat.format === "currency"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stat.value)
    : formatNumber(stat.value);

  return (
    <main className="portal-shell">
      <section className="hero" id="home">
        <div className="hero-content hero-content-clean">
          <div className="hero-intro max-w-[850px]">
            <p>Official MPLADS Monitoring Platform</p>
            <h1>Real-Time MPLADS Fund, Work & Asset Monitoring Platform</h1>
            <span>
              Comprehensive government monitoring system to track recommendations, sanctions, work execution,
              expenditure, and fund utilization across all Parliamentary Constituencies with explainable AI risk oversight.
            </span>
          </div>
        </div>

        <div className="tricolor-wave" aria-hidden="true">
          <span className="saffron" />
          <span className="white" />
          <span className="green" />
        </div>
      </section>


      <section className="section overview" id="about-the-scheme">
        <div className="section-heading">
          <p>System Overview</p>
          <h2>Comprehensive monitoring for transparent MPLADS implementation.</h2>
          <span>
            The MPLADS AI-Powered Monitoring Platform empowers MoSPI, State Nodal Authorities, District Authorities, and MPs to track recommendations, sanction delays, expenditure patterns, and physical completion rates across all Parliamentary Constituencies.
          </span>
        </div>
        <div className="overview-grid">
          {workflow.map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-band" id="dashboard">
        <div className="dashboard-copy">
          <p>Dashboard</p>
          <h2>Explainable risk intelligence for faster administrative action.</h2>
          <span>Updated {updatedAt}</span>
        </div>
        {dashboard?.dataAvailable ? <>
          <div className="flex flex-wrap items-center gap-2 mt-4 text-sm text-white/85">
            <span className={`rounded-full px-3 py-1 font-bold ${dashboard.source.verified ? "bg-emerald-500/25" : "bg-amber-400/25"}`}>
              {dashboard.source.label}
            </span>
            <span>Updated {updatedAt}</span>
          </div>
          <div className="stats-grid">
          {dashboard.stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{formatStat(stat)}</strong>
              <p>{stat.label}</p>
            </article>
          ))}
          </div>
          <div className="insight-layout">
          <article className="map-panel">
            <div>
              <MapPinned size={26} />
              <h3>Constituency Progress Scan</h3>
            </div>
            {dashboard.states.map((state) => (
              <label key={state.name}>
                <span>{state.name}</span>
                <meter min="0" max="100" value={state.progress} />
                <strong>{state.progress}%</strong>
              </label>
            ))}
          </article>
          <article className="assistant-panel">
            <Bot size={34} />
            <h3>AI Assistant</h3>
            <p>
              Ask for delayed projects, high-risk payments, progress mismatches or district-wise
              trends. The assistant explains why each work is flagged before officers investigate.
            </p>
            <div className="search-shell">
              <Search size={18} />
              <span>Show projects with risk score above 80</span>
            </div>
          </article>
          </div>
        </> : <div className="mt-8 rounded-lg border border-white/25 bg-white/10 px-6 py-8 text-white" role="status">
          <strong className="block text-lg">{loadError || "Loading dashboard data from PostgreSQL…"}</strong>
          <p className="mt-2 text-white/80">No dashboard figures are shown until the backend returns data.</p>
        </div>}
      </section>


      <footer className="relative w-full overflow-hidden bg-white border-t border-slate-200 py-3.5 px-6 sm:px-10 text-center text-[12px] text-[#082743] font-medium">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d86500] via-[#ff9933] to-[#f5b34c]" />
        © Powered by Enzo Team
      </footer>
    </main>
  );
}

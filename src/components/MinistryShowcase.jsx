import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, MapPinned, ShieldCheck } from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const INDIA_CENTER = [22.5, 79];
const displayScore = (project) => Math.min(96, Math.max(20, Number(project.riskScore ?? project.risk ?? 20)));
const riskLevel = (project) => project.riskLevel || (displayScore(project) >= 70 ? "High" : displayScore(project) >= 40 ? "Medium" : "Low");
const riskColor = (level) => level === "High" ? "#B23A32" : level === "Medium" ? "#D49A24" : "#138808";

function FitProjectBounds({ projects }) {
  const map = useMap();
  const points = projects.map((project) => [Number(project.latitude), Number(project.longitude)]).filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0);
  if (points.length > 1) map.fitBounds(points, { padding: [20, 20] });
  return null;
}

export default function MinistryShowcase({ data }) {
  const projects = data?.works || [];
  const [coordinates, setCoordinates] = useState({});
  useEffect(() => {
    fetch("/api/map-data")
      .then((response) => response.ok ? response.json() : [])
      .then((rows) => setCoordinates(Object.fromEntries(rows.map((row) => [row.id, row]))))
      .catch(() => setCoordinates({}));
  }, []);
  const projectsWithCoordinates = projects.map((project) => ({ ...project, ...(coordinates[project.id] || {}) }));
  const topProjects = useMemo(() => [...projects].sort((left, right) => displayScore(right) - displayScore(left) || String(left.id).localeCompare(String(right.id))).slice(0, 10), [projects]);
  const mappedProjects = projectsWithCoordinates.filter((project) => Number.isFinite(Number(project.latitude)) && Number.isFinite(Number(project.longitude)) && Number(project.latitude) !== 0 && Number(project.longitude) !== 0);

  return (
    <section className="bg-card border border-border rounded-[6px] p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div><div className="flex items-center gap-2"><ShieldCheck size={19} className="text-navy" /><h2 className="font-serif font-bold text-base text-ink">Ministry risk showcase</h2></div><p className="text-[12px] text-muted mt-1">Backend-ranked project exposure with the top 20 projects and their strongest evidence.</p></div>
        <span className="text-[11px] font-bold text-muted whitespace-nowrap">{projects.length.toLocaleString("en-IN")} loaded projects</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
        <div className="border border-border overflow-hidden min-h-[430px]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-paper"><h3 className="text-[12px] font-bold text-ink flex items-center gap-1.5"><MapPinned size={15} className="text-navy" /> Project locations</h3><span className="text-[11px] text-muted">{mappedProjects.length} with coordinates</span></div>
          {mappedProjects.length > 0 ? <MapContainer center={INDIA_CENTER} zoom={5} scrollWheelZoom={false} className="h-[390px] w-full"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FitProjectBounds projects={mappedProjects} />{mappedProjects.map((project) => <CircleMarker key={project.id} center={[Number(project.latitude), Number(project.longitude)]} radius={Math.max(5, Math.min(10, displayScore(project) / 12))} pathOptions={{ color: riskColor(riskLevel(project)), fillColor: riskColor(riskLevel(project)), fillOpacity: 0.7 }}><Popup><strong>{project.id}</strong><br />{project.name}<br />Risk {displayScore(project)} · {riskLevel(project)}<br />{project.mp} · {project.state}</Popup></CircleMarker>)}</MapContainer> : <div className="h-[390px] flex items-center justify-center text-center p-6 text-[12px] text-muted">No verified coordinates are available in the current backend response.</div>}
        </div>

        <div className="border border-border flex flex-col min-h-[430px]"><div className="px-3 py-2 border-b border-border bg-paper"><h3 className="text-[12px] font-bold text-ink flex items-center gap-1.5"><AlertTriangle size={15} className="text-[#B23A32]" /> Top 10 projects: why risk is high</h3></div><div className="overflow-y-auto max-h-[390px] divide-y divide-border">{topProjects.map((project, index) => <div key={project.id} className="p-3"><div className="flex items-start gap-2"><span className="text-[11px] text-muted font-bold w-5">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="text-[12px] font-bold text-ink truncate">{project.name}</div><span className="text-[11px] font-bold whitespace-nowrap" style={{ color: riskColor(riskLevel(project)) }}>{displayScore(project)} · {riskLevel(project)}</span></div><div className="text-[11px] text-muted mt-0.5">{project.id} · MP: {project.mp || "Not recorded"} · {project.state || "State not recorded"}</div><div className="text-[11px] text-subtle mt-1">{project.why || project.flagType || "Risk review required"}</div></div></div></div>)}{topProjects.length === 0 && <div className="p-4 text-[12px] text-muted">No backend projects available.</div>}</div></div>
      </div>
    </section>
  );
}

import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
} from "lucide-react";

export const NAV = [
  { key: "overview", label: "National Overview", icon: LayoutDashboard },
  { key: "risk", label: "Risk Monitoring", icon: ShieldAlert, badge: "34 Risk" },
  { key: "citizen", label: "Citizen Corner & Reports", icon: FileText },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="w-[240px] shrink-0 bg-[#062A47] text-white flex flex-col py-4 px-3 border-r border-navy-light/30 select-none">
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = page === n.key || (n.key === "risk" && (page === "mps" || page === "works" || page === "alerts"));
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className={
                "flex items-center justify-between px-3 py-2.5 rounded-[4px] text-[12.5px] text-left transition-all border-l-[3px] " +
                (active
                  ? "bg-white/15 text-white font-semibold border-saffron shadow-sm"
                  : "text-[#B9C9D9] border-transparent hover:bg-white/5 hover:text-white")
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} strokeWidth={active ? 2.2 : 1.75} className={active ? "text-saffron" : "text-[#B9C9D9]"} />
                <span className="truncate">{n.label}</span>
              </div>
              {n.badge && (
                <span
                  className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    n.key === "risk" || n.key === "alerts"
                      ? "bg-[#B23A32] text-white"
                      : "bg-saffron/20 text-saffron border border-saffron/30"
                  }`}
                >
                  {n.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

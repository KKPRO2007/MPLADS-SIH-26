import { ClipboardCheck, FilePlus2, Mail, ShieldCheck, TrendingUp, Users } from "lucide-react";

const ROLE_WORKSPACES = {
  mp: {
    title: "MP constituency workspace",
    summary: "Review recommended works, constituency progress, and requests sent to the District Authority.",
    actions: ["Recommend a work", "Review constituency alerts", "Track works sent for action"],
    icon: ClipboardCheck,
  },
  district_authority: {
    title: "District Authority workspace",
    summary: "Manage district works, review evidence, assign follow-up, and record verification outcomes.",
    actions: ["Review district alerts", "Update verification status", "Request missing records"],
    icon: ShieldCheck,
  },
  implementing_agency: {
    title: "Implementing Agency workspace",
    summary: "Submit project progress, expenditure, milestones, and supporting records for assigned works.",
    actions: ["Add project update", "Upload supporting information", "View returned corrections"],
    icon: FilePlus2,
  },
  state_nodal_authority: {
    title: "State Nodal Authority workspace",
    summary: "Compare district performance, manage escalations, and monitor unresolved work reviews across the state.",
    actions: ["Compare districts", "Assign review work", "Escalate unresolved cases"],
    icon: TrendingUp,
  },
  mospi: {
    title: "MoSPI monitoring workspace",
    summary: "View national trends, state and district performance, risk exposure, and review activity.",
    actions: ["Review national trends", "Monitor inactive jurisdictions", "Send review reminders"],
    icon: TrendingUp,
  },
  ministry: {
    title: "Ministry oversight workspace",
    summary: "View programme-wide performance, risk trends, completion gaps, and administrative follow-up.",
    actions: ["View national overview", "Review high-priority risks", "Track notifications"],
    icon: TrendingUp,
  },
  admin: {
    title: "Administrator workspace",
    summary: "Manage users, role assignments, access scope, system records, and audit activity.",
    actions: ["Manage user access", "Review audit activity", "Configure notifications"],
    icon: Users,
  },
};

export default function RoleWorkspacePage({ user, onNavigate }) {
  const workspace = ROLE_WORKSPACES[user?.role] || ROLE_WORKSPACES.mp;
  const Icon = workspace.icon;

  return (
    <div className="flex flex-col gap-5">
      <section className="bg-card border border-border rounded-[6px] p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-navy/10 text-navy flex items-center justify-center"><Icon size={21} /></div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted font-bold">{user?.roleLabel || "Authorized user"}</p>
            <h1 className="font-serif font-bold text-xl text-ink">{workspace.title}</h1>
            <p className="text-[13px] text-muted mt-1 max-w-3xl">{workspace.summary}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {workspace.actions.map((action) => (
          <button key={action} type="button" onClick={() => onNavigate(action.includes("alert") ? "risk" : "overview")} className="bg-card border border-border rounded-[6px] p-4 text-left hover:border-navy transition-colors">
            <strong className="text-sm text-ink">{action}</strong>
            <span className="block text-[12px] text-muted mt-1">Available within your assigned access scope.</span>
          </button>
        ))}
      </section>

      <section className="bg-card border border-border rounded-[6px] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3"><Mail size={17} className="text-navy" /><h2 className="font-serif font-bold text-base text-ink">Follow-up notifications</h2></div>
        <p className="text-[12px] text-muted">Review reminders and missing-update notifications will be addressed to the assigned role email after notification delivery is configured.</p>
      </section>
    </div>
  );
}

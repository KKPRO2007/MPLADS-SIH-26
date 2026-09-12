export default function SectionCard({ title, action, children, className = "" }) {
  return (
    <div className={"bg-card border border-border rounded-[4px] p-4 " + className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-[16px] text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

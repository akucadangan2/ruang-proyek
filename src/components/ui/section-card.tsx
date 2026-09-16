interface SectionCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ icon, title, description, action, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-line rounded-lg">
      <div className="flex items-start justify-between gap-3 px-5 py-3.5 border-b border-line">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-ink-soft">{icon}</span>}
          <div>
            <h3 className="font-semibold text-ink text-[13px] tracking-tight">{title}</h3>
            {description && <p className="text-[12px] text-ink-soft mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

interface IconProps {
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconGrid({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconPackage({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M21 8L12 3 3 8v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function IconReceipt({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3-6 7-6s7 2.7 7 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M23 20c0-2.6-2-4.8-5-5.6" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export function IconZap({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function IconFileText({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 2h9l5 5v15H6V2z" />
      <path d="M15 2v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10.3 21a2 2 0 003.4 0" />
    </svg>
  );
}

export function IconImage({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export function IconTag({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12.6 2H4v8.6L13.4 20 20 13.4 12.6 2z" />
      <circle cx="8" cy="8" r="1.3" />
    </svg>
  );
}

export function IconGift({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M3 12h18" />
      <path d="M12 8v13" />
      <path d="M12 8c-2 0-4-1.3-4-3.3A2.2 2.2 0 0110.2 2.5c1.8 0 2.8 2 2.8 5.5z" />
      <path d="M12 8c2 0 4-1.3 4-3.3A2.2 2.2 0 0013.8 2.5c-1.8 0-2.8 2-2.8 5.5z" />
    </svg>
  );
}

export function IconClipboard({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function IconChevronUp({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function IconShieldCheck({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M8.5 12l2.5 2.5L15.5 9" />
    </svg>
  );
}

export function IconLayoutTop({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </svg>
  );
}

export function IconLayoutBottom({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" />
    </svg>
  );
}

export function IconSliders({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M21 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

export function IconCreditCard({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

export function IconExternalLink({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

export function IconArrowUpDown({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
    </svg>
  );
}
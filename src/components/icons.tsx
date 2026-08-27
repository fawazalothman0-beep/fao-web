import { cn } from "@/lib/cn";

type IconName =
  | "search"
  | "building"
  | "key"
  | "handshake"
  | "doc"
  | "shield"
  | "chart"
  | "arrow"
  | "whatsapp"
  | "phone"
  | "mail"
  | "pin"
  | "check"
  | "bed"
  | "bath"
  | "ruler"
  | "tag";

const P: Record<IconName, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2M10 21v-3h4v3" /></>,
  key: <><circle cx="8" cy="8" r="4" /><path d="m11 11 9 9M17 17l2-2M15 15l2-2" /></>,
  handshake: <path d="m11 17 2 2 3-3M3 12l4-4 5 4 3-2 6 5-3 3-4-3-3 2-5-4-2 2z" />,
  doc: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v4h4M9 13h6M9 17h6" /></>,
  shield: <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6z" />,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  whatsapp: <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1-4.1A8 8 0 1 1 20 12z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  check: <path d="m4 12 5 5L20 6" />,
  bed: <path d="M3 8v10M3 12h18v6M21 18v-4a3 3 0 0 0-3-3h-5v3M7 11a2 2 0 1 0 0-.01" />,
  bath: <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 4 0M8 12V6" />,
  ruler: <><rect x="3" y="8" width="18" height="8" rx="1" transform="rotate(0)" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></>,
  tag: <><path d="M3 12 12 3h8v8l-9 9z" /><circle cx="16.5" cy="7.5" r="1.5" /></>,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-hidden
    >
      {P[name]}
    </svg>
  );
}

import type { TicketPriority } from "@/types/crm";

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  LOW: { label: "Lav", className: "bg-slate-100 text-slate-700 ring-slate-200" },
  MEDIUM: { label: "Medium", className: "bg-blue-50 text-blue-700 ring-blue-200" },
  HIGH: { label: "Høy", className: "bg-orange-50 text-orange-700 ring-orange-200" },
  CRITICAL: { label: "Kritisk", className: "bg-red-50 text-red-700 ring-red-200" },
};

export default function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}>
      {config.label}
    </span>
  );
}

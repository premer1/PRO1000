import type { TicketStatus } from "@/types/crm";

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  OPEN: { label: "Åpen", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  IN_PROGRESS: { label: "Pågår", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  WAITING: { label: "Venter", className: "bg-orange-50 text-orange-700 ring-orange-200" },
  CLOSED: { label: "Lukket", className: "bg-slate-100 text-slate-700 ring-slate-200" },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}>
      {config.label}
    </span>
  );
}

import { ArrowRight, Clock3, Sparkles, Ticket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { DashboardResponse, DashboardRecentTicket } from "@/types/crm";

function MetricCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-[var(--crm-border)] bg-white p-4">
      <div className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone}`}>{label}</div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function ActionLinkCard({ to, title, icon: Icon }: { to: string; title: string; icon: LucideIcon }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-md border border-[var(--crm-border)] bg-white p-3 transition hover:border-slate-300"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-slate-950 p-2 text-white">
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      </div>
      <ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-900" />
    </Link>
  );
}

function getPriorityRank(priority: DashboardRecentTicket["priority"]) {
  switch (priority) {
    case "CRITICAL":
      return 4;
    case "HIGH":
      return 3;
    case "MEDIUM":
      return 2;
    default:
      return 1;
  }
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<DashboardResponse>("/api/dashboard");
        if (!ignore) {
          setDashboard(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Kunne ikke hente dashboard");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <div className="rounded-xl border border-[var(--crm-border)] bg-white p-6 text-center text-slate-500">Laster...</div>;
  }

  if (error || !dashboard) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Feil: {error ?? "Dashboard-data mangler"}</div>;
  }

  const activeTickets = dashboard.openTickets + dashboard.inProgressTickets + dashboard.waitingTickets;
  const attentionQueue = [...dashboard.recentTickets]
    .filter((ticket) => ticket.status !== "CLOSED")
    .sort((left, right) => getPriorityRank(right.priority) - getPriorityRank(left.priority))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="CRM"
        title="Dashboard"
        actions={
          <>
            <Link
              to="/customers"
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Kunder
            </Link>
            <Link
              to="/tickets"
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Tickets
            </Link>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Aktive tickets</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{activeTickets}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Aktive kunder</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.activeCustomers}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Kø</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{attentionQueue.length}</p>
          </div>
        </div>
      </PageHero>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Kunder" value={dashboard.totalCustomers} tone="bg-emerald-50 text-emerald-700" />
        <MetricCard label="Aktive" value={dashboard.activeCustomers} tone="bg-sky-50 text-sky-700" />
        <MetricCard label="Åpne" value={activeTickets} tone="bg-amber-50 text-amber-700" />
        <MetricCard label="Lukkede" value={dashboard.closedTickets} tone="bg-slate-100 text-slate-700" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-950">Nylige tickets</h3>
              <Link to="/tickets" className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
                Alle
              </Link>
            </div>

            <div className="space-y-3 lg:hidden">
              {dashboard.recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="block rounded-md border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        #{ticket.ticketNo} {ticket.subject}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{ticket.companyName}</p>
                    </div>
                    <Clock3 size={16} className="mt-1 text-slate-300" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="mt-4 text-sm text-slate-500">{formatDateTime(ticket.updatedLast)}</p>
                </Link>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-md border border-slate-200 lg:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ticket</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Prioritet</th>
                    <th className="px-4 py-3 font-semibold">Oppdatert</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-t border-slate-200 text-sm">
                      <td className="px-4 py-4 align-top">
                        <Link to={`/tickets/${ticket.id}`} className="font-medium text-slate-950 transition hover:text-teal-700">
                          #{ticket.ticketNo} {ticket.subject}
                        </Link>
                        <p className="mt-1 text-slate-500">{ticket.companyName}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-4 py-4 text-slate-500">{formatDateTime(ticket.updatedLast)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-950">Kundeaktivitet</h3>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {dashboard.recentCustomerActivity.length}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {dashboard.recentCustomerActivity.map((customer) => (
                <div key={customer.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{customer.companyName}</p>
                      <p className="mt-1 text-sm text-slate-500">{customer.contactName}</p>
                    </div>
                    <Users size={16} className="mt-1 text-slate-300" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span>{customer.activeTickets} aktive</span>
                    <span>{customer.totalTickets} totalt</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">{formatDateTime(customer.updatedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-950">Prioritert kø</h3>
              <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                Prioritet
              </div>
            </div>

            <div className="space-y-3">
              {attentionQueue.length ? (
                attentionQueue.map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="block rounded-md border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          #{ticket.ticketNo} {ticket.subject}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{ticket.companyName}</p>
                      </div>
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-500">Ingen saker</div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <h3 className="text-base font-semibold text-slate-950">Status</h3>
            <div className="mt-5 space-y-4">
              {[
                { label: "Åpne", value: dashboard.openTickets, color: "bg-emerald-500" },
                { label: "Pågår", value: dashboard.inProgressTickets, color: "bg-amber-500" },
                { label: "Venter", value: dashboard.waitingTickets, color: "bg-orange-500" },
                { label: "Lukkede", value: dashboard.closedTickets, color: "bg-slate-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-medium text-slate-950">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${dashboard.totalTickets ? (item.value / dashboard.totalTickets) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <h3 className="text-base font-semibold text-slate-950">Hurtigvalg</h3>
            <div className="mt-5 space-y-3">
              <ActionLinkCard to="/customers" title="Kunder" icon={Users} />
              <ActionLinkCard to="/tickets" title="Tickets" icon={Ticket} />
              <ActionLinkCard to={dashboard.recentTickets[0] ? `/tickets/${dashboard.recentTickets[0].id}` : "/tickets"} title="AI" icon={Sparkles} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

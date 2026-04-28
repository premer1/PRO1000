import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Ticket } from "@/types/crm";

export default function AIAssistant() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadTickets() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Ticket[]>("/api/v1/tickets");
        if (!ignore) {
          setTickets(
            [...data].sort(
              (left, right) => new Date(right.updatedLast).getTime() - new Date(left.updatedLast).getTime(),
            ),
          );
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Kunne ikke hente tickets");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadTickets();
    return () => {
      ignore = true;
    };
  }, []);

  const actionableTickets = tickets.filter((ticket) => ticket.status !== "CLOSED");
  const highAttention = actionableTickets.filter(
    (ticket) => ticket.priority === "CRITICAL" || ticket.priority === "HIGH",
  );
  const fallbackCandidates = actionableTickets.slice(0, 8);

  if (loading) {
    return <div className="rounded-lg border border-[var(--crm-border)] bg-white p-6 text-center text-slate-500">Laster...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">Feil: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="CRM"
        title="AI"
        actions={
          <Link
            to="/tickets"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Alle tickets
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Åpne saker</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{actionableTickets.length}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Høy prioritet</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{highAttention.length}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Klar for AI</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{fallbackCandidates.length}</p>
          </div>
        </div>
      </PageHero>

      <section className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-950">Tickets for AI</h2>
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
            <Sparkles size={15} className="text-slate-500" />
            <span>Kjør AI fra ticketdetaljer</span>
          </div>
        </div>

        {fallbackCandidates.length ? (
          <div className="space-y-3">
            {fallbackCandidates.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex flex-col gap-4 rounded-md border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">
                    #{ticket.ticketNo} {ticket.subject}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{ticket.companyName}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{formatDateTime(ticket.updatedLast)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                    Åpne AI
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">Ingen åpne tickets</div>
        )}
      </section>
    </div>
  );
}

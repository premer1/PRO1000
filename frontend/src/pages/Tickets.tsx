import { Clock3, FilterX, Search, TriangleAlert } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "@/components/PageHero";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import TicketFormModal from "@/components/TicketFormModal";
import { apiFetch, buildQuery } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type {
  Customer,
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/types/crm";

function TicketStatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

export default function Tickets() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "OPEN">(
    "OPEN",
  );
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">(
    "ALL",
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadLookup() {
      try {
        const data = await apiFetch<Customer[]>("/api/customers/lookup");
        if (!ignore) {
          setCustomers(data);
        }
      } catch {
        if (!ignore) {
          setCustomers([]);
        }
      }
    }

    void loadLookup();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadTickets() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Ticket[]>(
          `/api/v1/tickets${buildQuery({
            query: deferredQuery || undefined,
            status: statusFilter === "ALL" ? undefined : statusFilter,
            priority: priorityFilter === "ALL" ? undefined : priorityFilter,
          })}`,
        );

        if (!ignore) {
          setTickets(
            [...data].sort(
              (left, right) =>
                new Date(right.updatedLast).getTime() -
                new Date(left.updatedLast).getTime(),
            ),
          );
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Kunne ikke hente tickets",
          );
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
  }, [deferredQuery, statusFilter, priorityFilter, refreshKey]);

  async function handleStatusChange(ticketId: number, status: TicketStatus) {
    try {
      const updated = await apiFetch<Ticket>(
        `/api/v1/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      setTickets((current) =>
        current.map((ticket) => (ticket.id === updated.id ? updated : ticket)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke oppdatere status",
      );
    }
  }

  function applyPreset(
    status: TicketStatus | "ALL",
    priority: TicketPriority | "ALL" = "ALL",
  ) {
    setStatusFilter(status);
    setPriorityFilter(priority);
  }

  const activeTickets = tickets.filter(
    (ticket) => ticket.status !== "CLOSED",
  ).length;
  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "CRITICAL" && ticket.status !== "CLOSED",
  ).length;
  const waitingTickets = tickets.filter(
    (ticket) => ticket.status === "WAITING",
  ).length;
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS",
  ).length;
  const urgentQueue = tickets.filter(
    (ticket) =>
      ticket.status !== "CLOSED" &&
      (ticket.priority === "CRITICAL" || ticket.priority === "HIGH"),
  );
  const filtersActive =
    query.length > 0 || statusFilter !== "ALL" || priorityFilter !== "ALL";

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="CRM"
        title="Tickets"
        actions={
          <>
            {filtersActive ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  applyPreset("ALL");
                }}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Nullstill
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setEditingTicket(null);
                setModalOpen(true);
              }}
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Ny ticket
            </button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <TicketStatCard label="Totalt" value={tickets.length} />
          <TicketStatCard label="Aktive" value={activeTickets} />
          <TicketStatCard label="Kritiske" value={criticalTickets} />
          <TicketStatCard label="Pågår" value={inProgressTickets} />
        </div>
      </PageHero>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <aside className="order-first xl:order-last xl:sticky xl:top-28 xl:self-start">
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-950">
                  Prioritert kø
                </h2>
                <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                  {urgentQueue.length}
                </div>
              </div>

              <div className="space-y-3">
                {urgentQueue.length ? (
                  urgentQueue.slice(0, 5).map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="w-full rounded-md border border-slate-200 p-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            #{ticket.ticketNo} {ticket.subject}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {ticket.companyName}
                          </p>
                        </div>
                        <TriangleAlert
                          size={16}
                          className="mt-1 text-red-400"
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                    Ingen saker
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-md border border-[var(--crm-border)] bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Ventende
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {waitingTickets}
                </p>
              </div>
              <div className="rounded-md border border-[var(--crm-border)] bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Kritiske
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {criticalTickets}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Tickets</h2>

              <button
                type="button"
                onClick={() => {
                  setEditingTicket(null);
                  setModalOpen(true);
                }}
                className="h-10 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Ny ticket
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.4fr_0.4fr]">
              <label className="relative block">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Søk"
                  className="h-10 rounded-md border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as TicketStatus | "ALL")
                }
                className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="ALL">Alle statuser</option>
                <option value="OPEN">Åpen</option>
                <option value="IN_PROGRESS">Pågår</option>
                <option value="WAITING">Venter</option>
                <option value="CLOSED">Lukket</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value as TicketPriority | "ALL",
                  )
                }
                className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="ALL">Alle prioriteter</option>
                <option value="LOW">Lav</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">Høy</option>
                <option value="CRITICAL">Kritisk</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Alle",
                  status: "ALL" as const,
                  priority: "ALL" as const,
                },
                {
                  label: "Ventende",
                  status: "WAITING" as const,
                  priority: "ALL" as const,
                },
                {
                  label: "Pågår",
                  status: "IN_PROGRESS" as const,
                  priority: "ALL" as const,
                },
                {
                  label: "Kritiske",
                  status: "ALL" as const,
                  priority: "CRITICAL" as const,
                },
                {
                  label: "Lukkede",
                  status: "CLOSED" as const,
                  priority: "ALL" as const,
                },
              ].map((preset) => {
                const active =
                  statusFilter === preset.status &&
                  priorityFilter === preset.priority;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.status, preset.priority)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}

              {filtersActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    applyPreset("ALL");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <FilterX size={14} />
                  Tøm
                </button>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-5 space-y-3 lg:hidden">
            {loading ? (
              <div className="rounded-md border border-slate-200 p-4 text-center text-sm text-slate-500">
                Laster...
              </div>
            ) : tickets.length ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-md border border-slate-200 p-3"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          #{ticket.ticketNo} {ticket.subject}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {ticket.companyName}
                        </p>
                      </div>
                      <Clock3 size={16} className="mt-1 text-slate-300" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="mt-4 space-y-1 text-sm text-slate-500">
                      <p>{ticket.category}</p>
                      <p>{formatDateTime(ticket.updatedLast)}</p>
                    </div>
                  </button>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTicket(ticket);
                        setModalOpen(true);
                      }}
                      className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Rediger
                    </button>
                    {ticket.status !== "CLOSED" ? (
                      <button
                        type="button"
                        onClick={() =>
                          void handleStatusChange(ticket.id, "CLOSED")
                        }
                        className="flex-1 rounded-md border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Lukk
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          void handleStatusChange(ticket.id, "OPEN")
                        }
                        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Gjenåpne
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
                Ingen treff
              </div>
            )}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-md border border-slate-200 lg:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ticket</th>
                  <th className="px-4 py-3 font-semibold">Kunde</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Prioritet</th>
                  <th className="px-4 py-3 font-semibold">Oppdatert</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      Laster...
                    </td>
                  </tr>
                ) : tickets.length ? (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-t border-slate-200 text-sm transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 align-top">
                        <button
                          type="button"
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="text-left font-medium text-slate-950 transition hover:text-teal-700"
                        >
                          #{ticket.ticketNo} {ticket.subject}
                        </button>
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600">
                        {ticket.companyName}
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600">
                        {ticket.category}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600">
                        {formatDateTime(ticket.updatedLast)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTicket(ticket);
                              setModalOpen(true);
                            }}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Rediger
                          </button>
                          {ticket.status !== "CLOSED" ? (
                            <button
                              type="button"
                              onClick={() =>
                                void handleStatusChange(ticket.id, "CLOSED")
                              }
                              className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                            >
                              Lukk
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                void handleStatusChange(ticket.id, "OPEN")
                              }
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                              Gjenåpne
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      Ingen treff
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <TicketFormModal
        open={modalOpen}
        ticket={editingTicket}
        customers={customers}
        onClose={() => setModalOpen(false)}
        onSaved={(ticket) => {
          setModalOpen(false);
          setEditingTicket(ticket);
          setRefreshKey((value) => value + 1);
        }}
      />
    </div>
  );
}

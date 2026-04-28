import { FilterX, Mail, Phone, Search, UserRound } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerFormModal from "@/components/CustomerFormModal";
import PageHero from "@/components/PageHero";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch, buildQuery } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Customer, PageResponse, Ticket as TicketType } from "@/types/crm";

function CustomerStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

export default function Customers() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [page, setPage] = useState(0);
  const [customerPage, setCustomerPage] = useState<PageResponse<Customer> | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerTickets, setCustomerTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadCustomers() {
      try {
        setLoading(true);
        setError(null);
        const params = buildQuery({
          query: deferredQuery || undefined,
          page,
          size: 8,
          sort: "companyName,asc",
        });
        const data = await apiFetch<PageResponse<Customer>>(`/api/customers${params}`);
        if (!ignore) {
          setCustomerPage(data);

          if (selectedCustomerId !== null) {
            const refreshedSelection = data.content.find((customer) => customer.id === selectedCustomerId);
            if (refreshedSelection) {
              setSelectedCustomer(refreshedSelection);
            } else {
              setSelectedCustomer(null);
              setSelectedCustomerId(null);
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Kunne ikke hente kunder");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadCustomers();
    return () => {
      ignore = true;
    };
  }, [deferredQuery, page, refreshKey, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerTickets([]);
      return;
    }

    let ignore = false;

    async function loadCustomerTickets() {
      try {
        setDetailLoading(true);
        const data = await apiFetch<TicketType[]>(`/api/v1/tickets${buildQuery({ customerId: selectedCustomerId })}`);
        if (!ignore) {
          setCustomerTickets(data);
        }
      } catch {
        if (!ignore) {
          setCustomerTickets([]);
        }
      } finally {
        if (!ignore) {
          setDetailLoading(false);
        }
      }
    }

    void loadCustomerTickets();
    return () => {
      ignore = true;
    };
  }, [selectedCustomerId]);

  function handleCustomerSelect(customer: Customer) {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);

    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(customer: Customer) {
    const confirmed = window.confirm(`Slette kunden "${customer.companyName}"? Historiske tickets beholdes, men kobles fra kunden.`);
    if (!confirmed) {
      return;
    }

    try {
      await apiFetch<void>(`/api/customers/${customer.id}`, { method: "DELETE" });
      if (selectedCustomerId === customer.id) {
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
      }
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette kunde");
    }
  }

  function openCreateModal() {
    setEditingCustomer(null);
    setModalOpen(true);
  }

  function openEditModal(customer: Customer) {
    setEditingCustomer(customer);
    setModalOpen(true);
  }

  const visibleCustomers = customerPage?.content ?? [];
  const totalCustomers = customerPage?.totalElements ?? 0;
  const openCustomerTickets = customerTickets.filter((ticket) => ticket.status !== "CLOSED").length;
  const waitingCustomerTickets = customerTickets.filter((ticket) => ticket.status === "WAITING").length;
  const closedCustomerTickets = customerTickets.filter((ticket) => ticket.status === "CLOSED").length;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="CRM"
        title="Kunder"
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Ny kunde
          </button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CustomerStatCard label="Totalt" value={totalCustomers} />
          <CustomerStatCard label="Viser" value={visibleCustomers.length} />
          <CustomerStatCard label="Valgt" value={selectedCustomer ? 1 : 0} />
          <CustomerStatCard label="Tickets" value={selectedCustomer ? customerTickets.length : 0} />
        </div>
      </PageHero>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <aside className="order-first xl:order-last xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <h2 className="text-base font-semibold text-slate-950">Kundedetaljer</h2>

            {selectedCustomer ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bedrift</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{selectedCustomer.companyName}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <UserRound size={15} className="text-slate-400" />
                      <span>
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={15} className="text-slate-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-slate-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDateTime(selectedCustomer.updatedAt)}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-emerald-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Aktive</p>
                    <p className="mt-2 text-xl font-semibold text-emerald-900">{openCustomerTickets}</p>
                  </div>
                  <div className="rounded-md bg-amber-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Venter</p>
                    <p className="mt-2 text-xl font-semibold text-amber-900">{waitingCustomerTickets}</p>
                  </div>
                  <div className="rounded-md bg-slate-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Lukkede</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{closedCustomerTickets}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedCustomer)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Rediger
                  </button>
                  <Link
                    to="/tickets"
                    className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Tickets
                  </Link>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-950">Tickets</h3>
                    <span className="text-sm text-slate-500">{customerTickets.length}</span>
                  </div>

                  <div className="space-y-3">
                    {detailLoading ? (
                      <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-500">Laster...</div>
                    ) : customerTickets.length ? (
                      customerTickets.map((ticket) => (
                        <Link
                          key={ticket.id}
                          to={`/tickets/${ticket.id}`}
                          className="block rounded-md border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                #{ticket.ticketNo} {ticket.subject}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">{ticket.category}</p>
                            </div>
                            <StatusBadge status={ticket.status} />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-500">Ingen tickets</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-md border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Velg kunde</div>
            )}
          </div>
        </aside>

        <section className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Kunder</h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(0);
                  }}
                  placeholder="Søk"
                  className="h-10 rounded-md border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <button
                type="button"
                onClick={openCreateModal}
                className="h-10 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Ny kunde
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <div className="rounded-full bg-slate-100 px-3 py-1.5">{loading ? "Laster..." : `${visibleCustomers.length} / ${totalCustomers}`}</div>
            <div className="rounded-full bg-slate-100 px-3 py-1.5">Side {customerPage ? customerPage.number + 1 : 1}</div>
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(0);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FilterX size={14} />
                Tøm
              </button>
            ) : null}
          </div>

          {error ? <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <div className="mt-5 space-y-3 lg:hidden">
            {loading ? (
              <div className="rounded-md border border-slate-200 p-4 text-center text-sm text-slate-500">Laster...</div>
            ) : visibleCustomers.length ? (
              visibleCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`rounded-md border p-3 transition ${
                    selectedCustomerId === customer.id ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <button type="button" onClick={() => handleCustomerSelect(customer)} className="w-full text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{customer.companyName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {customer.firstName} {customer.lastName}
                        </p>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {customer.customerNo}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>{customer.email}</p>
                      <p>{customer.phone}</p>
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDateTime(customer.updatedAt)}</p>
                  </button>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(customer)}
                      className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Rediger
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(customer)}
                      className="flex-1 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                    >
                      Slett
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">Ingen treff</div>
            )}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-md border border-slate-200 lg:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kundenr</th>
                  <th className="px-4 py-3 font-semibold">Bedrift</th>
                  <th className="px-4 py-3 font-semibold">Kontakt</th>
                  <th className="px-4 py-3 font-semibold">E-post</th>
                  <th className="px-4 py-3 font-semibold">Telefon</th>
                  <th className="px-4 py-3 font-semibold text-right">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                      Laster...
                    </td>
                  </tr>
                ) : visibleCustomers.length ? (
                  visibleCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`cursor-pointer border-t border-slate-200 text-sm transition hover:bg-slate-50 ${
                        selectedCustomerId === customer.id ? "bg-slate-50" : ""
                      }`}
                    >
                      <td className="px-4 py-4 font-medium text-slate-950">{customer.customerNo}</td>
                      <td className="px-4 py-4">{customer.companyName}</td>
                      <td className="px-4 py-4">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{customer.email}</td>
                      <td className="px-4 py-4 text-slate-600">{customer.phone}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEditModal(customer);
                            }}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Rediger
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDelete(customer);
                            }}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50"
                          >
                            Slett
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                      Ingen treff
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
            <span>
              Side {customerPage ? customerPage.number + 1 : 1} av {customerPage?.totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(0, value - 1))}
                disabled={!customerPage || customerPage.first}
                className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Forrige
              </button>
              <button
                type="button"
                onClick={() => setPage((value) => value + 1)}
                disabled={!customerPage || customerPage.last}
                className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Neste
              </button>
            </div>
          </div>
        </section>
      </div>

      <CustomerFormModal
        open={modalOpen}
        customer={editingCustomer}
        onClose={() => setModalOpen(false)}
        onSaved={(customer) => {
          setSelectedCustomer(customer);
          setSelectedCustomerId(customer.id);
          setRefreshKey((value) => value + 1);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

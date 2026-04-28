import { ArrowLeft, Copy, Mail, Phone, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Note, Ticket, TicketAssistant, TicketStatus } from "@/types/crm";

function buildTicketPayload(ticket: Ticket, overrides?: Partial<Ticket>) {
  const merged = { ...ticket, ...overrides };
  return {
    customerId: merged.customerId,
    subject: merged.subject,
    description: merged.description,
    contactName: merged.contactName,
    companyName: merged.companyName,
    email: merged.email,
    phone: merged.phone,
    status: merged.status,
    priority: merged.priority,
    category: merged.category,
  };
}

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [assistant, setAssistant] = useState<TicketAssistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [copyState, setCopyState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let ignore = false;

    async function loadTicket() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Ticket>(`/api/v1/tickets/${id}`);
        if (!ignore) {
          setTicket(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Kunne ikke hente ticket");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    async function loadNotes() {
      try {
        setNotesLoading(true);
        const data = await apiFetch<Note[]>(`/api/v1/tickets/${id}/notes`);
        if (!ignore) {
          setNotes(data);
        }
      } catch {
        if (!ignore) {
          setNotes([]);
        }
      } finally {
        if (!ignore) {
          setNotesLoading(false);
        }
      }
    }

    void loadTicket();
    void loadNotes();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleStatusChange(status: TicketStatus) {
    if (!id) {
      return;
    }

    try {
      const updated = await apiFetch<Ticket>(`/api/v1/tickets/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setTicket(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke oppdatere status");
    }
  }

  async function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !noteText.trim()) {
      return;
    }

    try {
      const created = await apiFetch<Note>(`/api/v1/tickets/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ text: noteText, createdBy: "CRM team" }),
      });
      setNotes((current) => [created, ...current]);
      setNoteText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke lagre notat");
    }
  }

  async function runAssistant() {
    if (!id) {
      return;
    }

    try {
      setAssistantLoading(true);
      setCopyState(null);
      const result = await apiFetch<TicketAssistant>(`/api/ai/tickets/${id}/assistant`, {
        method: "POST",
      });
      setAssistant(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke kjøre AI");
    } finally {
      setAssistantLoading(false);
    }
  }

  async function applyAssistantSuggestions() {
    if (!id || !ticket || !assistant) {
      return;
    }

    try {
      const updated = await apiFetch<Ticket>(`/api/v1/tickets/${id}`, {
        method: "PUT",
        body: JSON.stringify(
          buildTicketPayload(ticket, {
            priority: assistant.suggestedPriority,
            category: assistant.suggestedCategory,
          }),
        ),
      });
      setTicket(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke bruke AI-forslag");
    }
  }

  async function copySuggestedReply() {
    if (!assistant) {
      return;
    }

    try {
      await navigator.clipboard.writeText(assistant.suggestedReply);
      setCopyState("Kopiert");
    } catch {
      setCopyState("Kunne ikke kopiere");
    }
  }

  if (loading) {
    return <div className="rounded-xl border border-[var(--crm-border)] bg-white p-6 text-center text-slate-500">Laster...</div>;
  }

  if (error && !ticket) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Feil: {error}</div>;
  }

  if (!ticket) {
    return <div className="rounded-xl border border-[var(--crm-border)] bg-white p-4 text-slate-600">Fant ikke ticket</div>;
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="CRM"
        title={`#${ticket.ticketNo} ${ticket.subject}`}
        actions={
          <>
            <Link
              to="/tickets"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Tilbake
            </Link>
            <button
              type="button"
              onClick={() => void runAssistant()}
              disabled={assistantLoading}
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {assistantLoading ? "Analyserer..." : "Kjør AI"}
            </button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
            {ticket.category}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
            {ticket.companyName}
          </span>
        </div>
      </PageHero>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-medium text-slate-500">Beskrivelse</p>
                <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-800">{ticket.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Kontakt</p>
                  <p className="mt-2 text-slate-950">{ticket.contactName}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Kategori</p>
                  <p className="mt-2 text-slate-950">{ticket.category}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Opprettet</p>
                  <p className="mt-2 text-slate-950">{formatDate(ticket.created)}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Oppdatert</p>
                  <p className="mt-2 text-slate-950">{formatDateTime(ticket.updatedLast)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-semibold text-slate-950">Status</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "Åpen", status: "OPEN" as const },
                  { label: "Pågår", status: "IN_PROGRESS" as const },
                  { label: "Venter", status: "WAITING" as const },
                  { label: "Lukket", status: "CLOSED" as const },
                ].map((item) => (
                  <button
                    key={item.status}
                    type="button"
                    onClick={() => void handleStatusChange(item.status)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                      ticket.status === item.status
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Notater</h2>
              <span className="text-sm text-slate-500">{notes.length}</span>
            </div>

            <form onSubmit={handleAddNote} className="mt-5 space-y-3">
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={4}
                placeholder="Legg til notat"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              />
              <button
                type="submit"
                className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Lagre
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {notesLoading ? (
                <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-500">Laster...</div>
              ) : notes.length ? (
                notes.map((note) => (
                  <div key={note.id} className="rounded-md border border-slate-200 p-3">
                    <p className="text-slate-800">{note.text}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span>{note.createdBy}</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-500">Ingen notater</div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-950">AI</h2>
              <div className="rounded-md bg-slate-950 p-2 text-white">
                <Sparkles size={18} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void runAssistant()}
                disabled={assistantLoading}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assistantLoading ? "Analyserer..." : assistant ? "Kjør på nytt" : "Kjør AI"}
              </button>
              {assistant ? (
                <button
                  type="button"
                  onClick={() => void applyAssistantSuggestions()}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Bruk forslag
                </button>
              ) : null}
            </div>

            {assistant ? (
              <div className="mt-6 space-y-4">
                {assistant.fallbackUsed ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Fallback aktiv</div>
                ) : null}

                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Oppsummering</p>
                  <p className="mt-3 text-sm leading-6 text-slate-800">{assistant.summary}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-500">Prioritet</p>
                    <div className="mt-3">
                      <PriorityBadge priority={assistant.suggestedPriority} />
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-500">Kategori</p>
                    <p className="mt-3 text-sm font-medium text-slate-950">{assistant.suggestedCategory}</p>
                  </div>
                </div>

                <div className="rounded-md bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500">Svarutkast</p>
                    <button
                      type="button"
                      onClick={() => void copySuggestedReply()}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Copy size={14} />
                      Kopier
                    </button>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">{assistant.suggestedReply}</p>
                  {copyState ? <p className="mt-3 text-sm text-slate-500">{copyState}</p> : null}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">Ingen analyse</div>
            )}
          </div>

          <div className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
            <h2 className="text-base font-semibold text-slate-950">Kontakt</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-500">Bedrift</p>
                <p className="mt-2 text-slate-950">{ticket.companyName}</p>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <UserRound size={15} />
                  Kontakt
                </div>
                <p className="mt-2 text-slate-950">{ticket.contactName}</p>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Mail size={15} />
                  E-post
                </div>
                <p className="mt-2 break-all text-slate-950">{ticket.email}</p>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Phone size={15} />
                  Telefon
                </div>
                <p className="mt-2 text-slate-950">{ticket.phone}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Opprettet</p>
                  <p className="mt-2 text-slate-950">{formatDate(ticket.created)}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-500">Lukket</p>
                  <p className="mt-2 text-slate-950">{formatDate(ticket.closedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

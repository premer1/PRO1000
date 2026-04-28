import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Customer, Ticket, TicketPriority, TicketStatus } from "@/types/crm";

type TicketFormState = {
  customerId: string;
  subject: string;
  description: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
};

type FieldErrors = Partial<Record<keyof TicketFormState, string>>;

interface TicketFormModalProps {
  open: boolean;
  ticket: Ticket | null;
  customers: Customer[];
  onClose: () => void;
  onSaved: (ticket: Ticket) => void;
}

function createEmptyState(): TicketFormState {
  return {
    customerId: "",
    subject: "",
    description: "",
    contactName: "",
    companyName: "",
    email: "",
    phone: "",
    status: "OPEN",
    priority: "MEDIUM",
    category: "General",
  };
}

export default function TicketFormModal({ open, ticket, customers, onClose, onSaved }: TicketFormModalProps) {
  const [form, setForm] = useState<TicketFormState>(createEmptyState());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (ticket) {
      setForm({
        customerId: ticket.customerId ? String(ticket.customerId) : "",
        subject: ticket.subject,
        description: ticket.description,
        contactName: ticket.contactName,
        companyName: ticket.companyName,
        email: ticket.email,
        phone: ticket.phone,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
      });
    } else {
      setForm(createEmptyState());
    }

    setFieldErrors({});
    setSubmitError(null);
  }, [open, ticket]);

  function applyCustomer(customerId: string) {
    const selectedCustomer = customers.find((customer) => String(customer.id) === customerId);
    if (!selectedCustomer) {
      setForm((current) => ({ ...current, customerId }));
      return;
    }

    setForm((current) => ({
      ...current,
      customerId,
      companyName: selectedCustomer.companyName,
      contactName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      email: selectedCustomer.email,
      phone: selectedCustomer.phone,
    }));
  }

  function validate(values: TicketFormState) {
    const nextErrors: FieldErrors = {};

    if (!values.subject.trim()) nextErrors.subject = "Emne er påkrevd";
    if (!values.description.trim()) nextErrors.description = "Beskrivelse er påkrevd";
    if (!values.contactName.trim()) nextErrors.contactName = "Kontaktperson er påkrevd";
    if (!values.companyName.trim()) nextErrors.companyName = "Firmanavn er påkrevd";
    if (!values.email.trim()) nextErrors.email = "E-post er påkrevd";
    if (!values.email.includes("@")) nextErrors.email = "E-post må være gyldig";
    if (!values.phone.trim()) nextErrors.phone = "Telefon er påkrevd";
    if (!values.category.trim()) nextErrors.category = "Kategori er påkrevd";

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(form);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);
      setSubmitError(null);

      const payload = {
        customerId: form.customerId ? Number(form.customerId) : null,
        subject: form.subject,
        description: form.description,
        contactName: form.contactName,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        status: form.status,
        priority: form.priority,
        category: form.category,
      };

      const path = ticket ? `/api/v1/tickets/${ticket.id}` : "/api/v1/tickets";
      const method = ticket ? "PUT" : "POST";

      const saved = await apiFetch<Ticket>(path, {
        method,
        body: JSON.stringify(payload),
      });

      onSaved(saved);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Kunne ikke lagre ticket");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{ticket ? "Rediger ticket" : "Opprett ticket"}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Lukk
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Kunde</span>
              <select
                value={form.customerId}
                onChange={(event) => applyCustomer(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="">Velg kunde</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
            </label>

            {[
              { key: "subject", label: "Emne" },
              { key: "category", label: "Kategori" },
              { key: "contactName", label: "Kontaktperson" },
              { key: "companyName", label: "Firmanavn" },
              { key: "email", label: "E-post", type: "email" },
              { key: "phone", label: "Telefon" },
            ].map((field) => {
              const fieldKey = field.key as keyof TicketFormState;
              return (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
                  <input
                    type={field.type ?? "text"}
                    value={form[fieldKey]}
                    onChange={(event) => setForm((current) => ({ ...current, [fieldKey]: event.target.value }))}
                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
                  />
                  {fieldErrors[fieldKey] ? <span className="mt-2 block text-xs text-red-600">{fieldErrors[fieldKey]}</span> : null}
                </label>
              );
            })}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TicketStatus }))}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="OPEN">Åpen</option>
                <option value="IN_PROGRESS">Pågår</option>
                <option value="WAITING">Venter</option>
                <option value="CLOSED">Lukket</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Prioritet</span>
              <select
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TicketPriority }))}
                className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="LOW">Lav</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">Høy</option>
                <option value="CRITICAL">Kritisk</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Beskrivelse</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={5}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              />
              {fieldErrors.description ? <span className="mt-2 block text-xs text-red-600">{fieldErrors.description}</span> : null}
            </label>
          </div>

          {submitError ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</div> : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Lagrer..." : ticket ? "Lagre endringer" : "Opprett ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

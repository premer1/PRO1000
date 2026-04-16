import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Customer } from "@/types/crm";

type CustomerFormState = {
  customerNo: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type FieldErrors = Partial<Record<keyof CustomerFormState, string>>;

const emptyState: CustomerFormState = {
  customerNo: "",
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

interface CustomerFormModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
}

export default function CustomerFormModal({ open, customer, onClose, onSaved }: CustomerFormModalProps) {
  const [form, setForm] = useState<CustomerFormState>(emptyState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (customer) {
      setForm({
        customerNo: customer.customerNo,
        companyName: customer.companyName,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setForm(emptyState);
    }

    setFieldErrors({});
    setSubmitError(null);
  }, [open, customer]);

  function validate(values: CustomerFormState) {
    const nextErrors: FieldErrors = {};

    if (!values.customerNo.trim()) nextErrors.customerNo = "Kundenummer er påkrevd";
    if (!values.companyName.trim()) nextErrors.companyName = "Bedriftsnavn er påkrevd";
    if (!values.firstName.trim()) nextErrors.firstName = "Fornavn er påkrevd";
    if (!values.lastName.trim()) nextErrors.lastName = "Etternavn er påkrevd";
    if (!values.email.trim()) nextErrors.email = "E-post er påkrevd";
    if (!values.email.includes("@")) nextErrors.email = "E-post må være gyldig";
    if (!values.phone.trim()) nextErrors.phone = "Telefon er påkrevd";

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
      const path = customer ? `/api/customers/${customer.id}` : "/api/customers";
      const method = customer ? "PUT" : "POST";
      const saved = await apiFetch<Customer>(path, {
        method,
        body: JSON.stringify(form),
      });
      onSaved(saved);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Kunne ikke lagre kunde");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{customer ? "Rediger kunde" : "Opprett kunde"}</h2>
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
            {[
              { key: "customerNo", label: "Kundenummer" },
              { key: "companyName", label: "Bedriftsnavn" },
              { key: "firstName", label: "Fornavn" },
              { key: "lastName", label: "Etternavn" },
              { key: "email", label: "E-post", type: "email" },
              { key: "phone", label: "Telefon" },
            ].map((field) => {
              const fieldKey = field.key as keyof CustomerFormState;
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
              {saving ? "Lagrer..." : customer ? "Lagre endringer" : "Opprett kunde"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

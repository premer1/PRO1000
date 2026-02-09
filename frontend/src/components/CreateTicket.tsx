import { useEffect, useMemo, useState } from "react";

type CreateTicket = {
    description: string;
    companyName: string;
    phone: string;
    email: string;
};

type Ticket = {
    id: number;
    ticketNo: number;
    status: "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";
    created: string;
    updatedLast: string | null;
    description: string;
    companyName: string;
    phone: string;
    email: string;
};

export async function createTicket(payload: CreateTicket): Promise<Ticket> {
    const res = await fetch("http://localhost:8080/api/v1/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Kunne ikke opprette ticket");
    }

    return (await res.json()) as Ticket;
}

export function CreateTicketForm({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<CreateTicket>({
        description: "",
        companyName: "",
        phone: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ autocomplete
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestLoading, setSuggestLoading] = useState(false);
    const [pickedFromList, setPickedFromList] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    function onChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "companyName") {
            // hvis brukeren skriver selv, er den ikke “godkjent” før den matcher/velges
            setPickedFromList(false);
            setShowSuggestions(true);
        }
    }

    // ✅ Debounced suggest lookup
    useEffect(() => {
        const q = form.companyName.trim();

        if (q.length < 2) {
            setSuggestions([]);
            setSuggestLoading(false);
            return;
        }

        setSuggestLoading(true);

        const t = window.setTimeout(async () => {
            try {
                // 👉 Bytt til /api/v1/customers/suggest hvis du bruker Customer som kilde
                const res = await fetch(
                    `http://localhost:8080/api/v1/tickets/suggest?q=${encodeURIComponent(q)}`,
                );

                if (!res.ok) {
                    setSuggestions([]);
                    return;
                }

                const list = (await res.json()) as string[];
                setSuggestions(list);

                // hvis eksakt match finnes, kan vi tillate submit selv uten klikk
                const exact = list.some(
                    (x) => x.toLowerCase() === q.toLowerCase(),
                );
                if (exact) setPickedFromList(true);
            } finally {
                setSuggestLoading(false);
            }
        }, 250);

        return () => window.clearTimeout(t);
    }, [form.companyName]);

    const canSubmit = useMemo(() => {
        // krever at companyName finnes i databasen (via match/valg)
        return (
            form.companyName.trim().length > 0 &&
            pickedFromList &&
            form.email.trim().length > 0 &&
            form.phone.trim().length > 0 &&
            form.description.trim().length > 0
        );
    }, [form, pickedFromList]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setError(null);

        try {
            await createTicket(form);
            onClose();
            setForm({ description: "", companyName: "", phone: "", email: "" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Noe gikk galt");
        } finally {
            setLoading(false);
        }
    }

    function pickCompany(name: string) {
        setForm((prev) => ({ ...prev, companyName: name }));
        setPickedFromList(true);
        setShowSuggestions(false);
        setSuggestions([]);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={() => !loading && onClose()}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/10"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold cursor-default">Opprett ticket</h2>

                    <button
                        type="button"
                        onClick={() => !loading && onClose()}
                        className="relative h-10 w-10 rounded-xl ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-50 cursor-pointer"
                        disabled={loading}
                        aria-label="Lukk"
                    >
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* ✅ CompanyName + dropdown */}
                    <div className="relative">
                        <input
                            name="companyName"
                            value={form.companyName}
                            onChange={onChange}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Firmanavn"
                            className={`w-full rounded-xl p-2 ring-1 ${
                                form.companyName.trim().length === 0
                                    ? "ring-black/10"
                                    : pickedFromList
                                        ? "ring-black/10"
                                        : "ring-red-500"
                            }`}
                            required
                        />

                        {showSuggestions && (suggestLoading || suggestions.length > 0) && (
                            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl bg-white shadow ring-1 ring-black/10">
                                {suggestLoading && (
                                    <div className="px-3 py-2 text-sm opacity-70">
                                        Søker…
                                    </div>
                                )}

                                {!suggestLoading && suggestions.length === 0 && (
                                    <div className="px-3 py-2 text-sm opacity-70">
                                        Ingen treff
                                    </div>
                                )}

                                {!suggestLoading &&
                                    suggestions.map((name) => (
                                        <button
                                            key={name}
                                            type="button"
                                            className="w-full text-left px-3 py-2 hover:bg-black/5"
                                            onClick={() => pickCompany(name)}
                                        >
                                            {name}
                                        </button>
                                    ))}
                            </div>
                        )}

                        {!pickedFromList && form.companyName.trim().length > 0 && (
                            <p className="mt-1 text-sm text-red-600">
                                Velg et eksisterende firmanavn fra listen.
                            </p>
                        )}
                    </div>

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="E-post"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10"
                        required
                    />

                    <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="Telefon"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Beskrivelse"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10"
                        rows={4}
                        required
                    />

                    {error && <p className="text-red-600">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading || !canSubmit}
                            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Oppretter…" : "Opprett ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

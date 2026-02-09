import {useState} from "react";

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

    function onChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createTicket(form);
            onClose?.();
            setForm({ description: "", companyName: "", phone: "", email: "" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Noe gikk galt");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={() => !loading && onClose?.()}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/10"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold cursor-default">Opprett ticket</h2>

                    <button
                        type="button"
                        onClick={() => !loading && onClose?.()}
                        className="relative h-10 w-10 rounded-xl ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-50 cursor-pointer"
                        disabled={loading}
                        aria-label="Lukk"
                    >
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        name="companyName"
                        value={form.companyName}
                        onChange={onChange}
                        placeholder="Firmanavn"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10 cursor-pointer"
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="E-post"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10 cursor-pointer"
                        required
                    />

                    <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="Telefon"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10 cursor-pointer"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Beskrivelse"
                        className="w-full rounded-xl p-2 ring-1 ring-black/10 cursor-pointer"
                        rows={4}
                        required
                    />

                    {error && <p className="text-red-600">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={close}
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
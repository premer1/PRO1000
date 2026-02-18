import { useEffect, useState } from "react";
import { statusLabel } from "../types/TicketStatus.ts";
import { Link } from "react-router-dom";
import {CreateTicketForm} from "../components/CreateTicket.tsx";

type Ticket = {
    id: number;
    ticketNo: number;
    description: string;
    companyName: string;
    email: string;
    phone: string;
    created: string;
    updatedLast: string | null;
    status: string;
};

type PageResponse<T> = {
    content: T[];
};

export default function TicketsTable() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [page, setPage] = useState(0);
    const size = 20;

    // 1) Debounce: oppdater "debouncedQuery" først når brukeren har pause
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), 400);
        return () => clearTimeout(t);
    }, [query]);

    // 2) Når debouncedQuery endrer seg, gå tilbake til side 0
    useEffect(() => {
        setPage(0);
    }, [debouncedQuery]);

    // 3) Fetch basert på debouncedQuery + page
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("size", String(size));

                if (debouncedQuery.trim()) {
                    params.set("q", debouncedQuery.trim());
                }

                const res = await fetch(
                    `http://localhost:8080/api/v1/tickets?${params.toString()}`
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = (await res.json()) as PageResponse<Ticket>;
                setTickets(json.content ?? []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Ukjent feil");
                setTickets([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [debouncedQuery, page]);

    const searchBox =
        "rounded-4xl bg-white p-3 outline-none shadow ring-1 ring-black/5 focus:ring-black/20";
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col justify-start">
            <div className="w-200 py-20 flex justify-start items-center gap-10">
                <div className="flex gap-4">
                    <input
                        className={`${searchBox} w-100`}
                        placeholder="Søk i saker med e-post, telefon eller firma"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {loading && <span className="text-sm opacity-70">Søker…</span>}
                </div>
                <div>
                    <button
                        className={searchBox}
                        onClick={() => setOpen(true)}
                    >
                        Opprett ticket
                    </button>
                            {open && <CreateTicketForm onClose={() => setOpen(false)} />
                            }
                </div>

                {error && <div className="text-sm">Feil: {error}</div>}
            </div>

            <div className="flex flex-col justify-start items-start">
                <table className="w-full table-fixed border-separate border-spacing-0">
                    <thead>
                    <tr className="text-left text-sm opacity-80">
                        <th className="px-4 py-2 w-[90px]">Saksnr</th>
                        <th className="px-4 py-2 w-[180px]">Bedrift</th>
                        <th className="px-4 py-2">Beskrivelse</th>
                        <th className="px-4 py-2 w-[220px]">E-post</th>
                        <th className="px-4 py-2 w-[140px]">Telefon</th>
                        <th className="px-4 py-2 w-[140px]">Status</th>
                    </tr>
                    </thead>

                    <tbody className="text-sm">
                    {tickets.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-3 opacity-70">
                                Ingen tickets
                            </td>
                        </tr>
                    ) : (
                        tickets.map((t) => (
                            <tr key={t.id} className="group">
                                <td colSpan={6} className="p-0 border-t border-black/10">
                                    <Link
                                        to={`/tickets/${t.ticketNo}`}
                                        className="
                grid grid-cols-[90px_180px_1fr_220px_140px_140px]
                items-center gap-4
                px-4 py-3
                transition
                hover:bg-black/5
              "
                                        aria-label={`Åpne ticket ${t.ticketNo}`}
                                    >
                                        <span className="truncate">{t.ticketNo}</span>
                                        <span className="truncate">{t.companyName}</span>
                                        <span className="truncate">{t.description}</span>
                                        <span className="truncate">{t.email}</span>
                                        <span className="truncate">{t.phone}</span>
                                        <span className="truncate">{statusLabel(t.status)}</span>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <div className="mt-4 flex py-10 gap-2">
                    <button
                        className="rounded-xl px-4 py-2 ring-1 ring-black/10 disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                    >
                        Forrige
                    </button>

                    <button
                        className="rounded-xl px-4 py-2 ring-1 ring-black/10 disabled:opacity-50"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={tickets.length < size}
                    >
                        Neste
                    </button>
                </div>
            </div>
        </div>
    );
}

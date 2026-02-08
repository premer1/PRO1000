import { useEffect, useState } from "react";
import { statusLabel } from "../types/TicketStatus.ts";
import { Link } from "react-router-dom";

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
                    <button className={searchBox}>Opprett Ticket</button>
                </div>

                {error && <div className="text-sm">Feil: {error}</div>}
            </div>

            <div className="flex flex-col justify-start items-start">
                <table>
                    <thead>
                    <tr>
                        <th className="text-left">Saksnr</th>
                        <th className="text-left px-4">Bedrift</th>
                        <th className="text-left px-4">Beskrivelse</th>
                        <th className="text-left px-4">E-post</th>
                        <th className="text-left px-4">Telefon</th>
                        <th className="text-left px-4">Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {tickets.length === 0 ? (
                        <tr>
                            <td colSpan={6}>Ingen tickets</td>
                        </tr>
                    ) : (
                        tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-black/5">
                                <td className="relative">
                                    <Link
                                        to={`/tickets/${t.ticketNo}`}
                                        className="absolute inset-0"
                                        aria-label={`Åpne ticket ${t.ticketNo}`}
                                    />
                                    {t.ticketNo}
                                </td>
                                <td className="px-4">{t.companyName}</td>
                                <td className="px-4">{t.description}</td>
                                <td className="px-4">{t.email}</td>
                                <td className="px-4">{t.phone}</td>
                                <td className="px-4">{statusLabel(t.status)}</td>
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

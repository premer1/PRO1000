
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {TicketsType} from "../types/TicketsType.ts";

export function TicketOpen() {
    const { ticketNo } = useParams<{ ticketNo: string }>();

    const [ticket, setTicket] = useState<TicketsType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ticketNo) {
            setError("Mangler ticketNo i URL");
            return;
        }

        (async () => {
            try {
                setError(null);

                const res = await fetch(
                    `http://localhost:8080/api/v1/tickets/by-ticket-no/${ticketNo}`
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = (await res.json()) as TicketsType;
                setTicket(json);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Kunne ikke hente ticket");
                setTicket(null);
            }
        })();
    }, [ticketNo]);

    if (error) return <div>Feil: {error}</div>;
    if (!ticket) return <div>Laster...</div>;

    return (
        <div>
            <h1>Ticket #{ticket.ticketNo}</h1>
            <div>{ticket.companyName}</div>
            <div>{ticket.description}</div>
            <div>
                {ticket.email} • {ticket.phone}
            </div>
        </div>
    );
}


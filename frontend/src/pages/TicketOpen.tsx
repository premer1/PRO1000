
import { useParams } from "react-router-dom";
import { useEffect, useState} from "react";
import type {TicketsType} from "../types/TicketsType.ts";
import {STATUS_LABEL} from "../types/TicketStatus.ts";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";

export function TicketOpen() {
    const { ticketNo } = useParams<{ ticketNo: string }>();
    const [open, setOpen] = useState<boolean>(false);
    const toggleOpen = () => setOpen((prev) => !prev);
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

async function updateStatus(nextStatus: TicketStatus) {

    try {
        setError(null);

        const res = await fetch(`http://localhost:8080/api/v1/tickets/${ticketNo}/status`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({status: nextStatus}),
            }
        );

    if (!res.ok) {
        setError("Failed to update ticket");
    }
            const updatedTicket = (await res.json());
            setTicket(updatedTicket);

            setOpen(false);

    } catch (e) {
            setError("Network Error: Unable to update ticket status");
        }
    }

    return (
            <div>
                <h1>Ticket #{ticket.ticketNo}</h1>
                <div>{ticket.companyName}</div>
                <div>{ticket.description}</div>
                <div>
                    {ticket.email} • {ticket.phone}
                </div>
                <div className="flex gap-4">
                    <p>Status:</p>
                    <div className="">

                        <button onClick={() => {
                            toggleOpen();
                            console.log("knapp trykket på");
                        }} className="rounded text-black ring-1 ring-black px-4">
                            {STATUS_LABEL[ticket.status]}
                        </button>


                        {open && (
                            <div className="flex flex-col justify-start items-start ring-1 ring-black/10 w-fit px-6">
                                <button onClick={() => updateStatus("OPEN")}>Åpen</button>
                                <button onClick={() => updateStatus("IN_PROGRESS")}>Under arbeid</button>
                                <button onClick={() => updateStatus("WAITING")}>Venter på oss</button>
                                <button onClick={() => updateStatus("CLOSED")}>Lukket</button>
                            </div>
                            )}
                </div>

                </div>
            </div>
        );
}


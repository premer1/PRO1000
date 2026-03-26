import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {CreateTickets} from "@/components/Tickets/CreateTicket";

type Ticket = {
    id: number,
    ticketNo: number,
    subject: string,
    companyName: string,
    status: string,
    updatedLast: Date,
}

type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";

export function GetTickets() {

    const [showForm, setShowForm] = useState(false);

    function openForm() {
        setShowForm(prev => !prev); // Gjør at man kan åpne og lukke vinduet ved å trykke på nytt.
    }

        const [tickets, setTickets] = useState<Ticket[]>([]);
        const [selectedStatus, setSelectedStatus] = useState("OPEN");

        const navigate = useNavigate();

        const filteredTickets = tickets.filter((ticket) => ticket.status === selectedStatus);

        const statusLabels: Record<TicketStatus, string> = {
            OPEN: "Åpen",
            WAITING: "Venter",
            IN_PROGRESS: "Pågår",
            CLOSED: "Lukket",
        };


        useEffect(() => {
            async function loadTickets() {
                const response = await fetch("http://localhost:8080/api/v1/tickets", {
                    method: 'GET',
                    headers: {"Content-Type": "application/json"}
                });

                if(!response.ok) {
                    throw Error("Failed to fetch tickets.");
                }

                const data= await response.json();
                setTickets(data);
                console.log(data);
            }
            loadTickets();
        }, []);


    return (
        <>
            <div className="mt- bg-white rounded-2xl p-6 text-lg">
                <div className="flex gap-4">
                    <Button type="button" onClick={openForm}>Opprett Ticket</Button>
                    <CreateTickets  showForm={showForm} />
                    <Button
                        className="mb-8"
                        onChange={(e) => setSelectedStatus(e.target.value)}>
                    <select className="">

                            <option value="OPEN">Åpne</option>
                            <option value="IN_PROGRESS">Pågår</option>
                            <option value="WAITING">Venter</option>
                            <option value="CLOSED">Lukket</option>


                    </select>
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-lg hidden lg:block md:place-content-center">Ticketnr.</TableHead>
                            <TableHead className="text-lg md:text-xl">Emne</TableHead>
                            <TableHead className="text-lg md:text-xl">Bedriftsnavn</TableHead>
                            <TableHead className="text-lg md:text-xl">Status</TableHead>
                            <TableHead className="text-lg hidden lg:block md:place-content-center">Sist oppdatert</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-lg">
                        {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}
                                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                                  className="cursor-pointer"
                        >
                            <TableCell className="font-medium hidden lg:block">{ticket.ticketNo}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{ticket.companyName}</TableCell>
                            <TableCell>{statusLabels[ticket.status]}</TableCell>
                            <TableCell className="hidden lg:block lg:place-content-center">{new Date(ticket.updatedLast).toLocaleString("no-NO")}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

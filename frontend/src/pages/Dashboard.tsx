import CountTickets from "@/components/Tickets/CountTickets";


const Dashboard = () => {
    return (
<>
        <header className="flex flex-col items-center justify-center font-bold text-3xl">
            Dashboard
        </header>
        <div>
            <CountTickets />
        </div>




</>
    )
};

export default Dashboard;
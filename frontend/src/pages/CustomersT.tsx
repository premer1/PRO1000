import CustomerTable from "../components/CustomerTable.tsx";
import AddCustomer from "../components/AddCustomer.tsx";
import {useState} from "react";

export default function CustomersT() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshData = () => {
        console.log("Oppdaterer tabell...");
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Kundeliste</h1>
                    <p className="text-slate-800 text-sm">Oversikt over alle registrerte kunder i systemet.</p>
                </div>
                <button
                    onClick={() => {setIsModalOpen(true);}}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    + Ny kunde
                </button>
            </div>

            <CustomerTable />

            <AddCustomer isOpen={isModalOpen}
                         onClose={() => setIsModalOpen(false)}
                         onCustomerAdded={refreshData}
                         />
        </div>
    );
}
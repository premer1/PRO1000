import CustomerTable from "../components/CustomerTable.tsx";

export default function CustomersT() {

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Kundeliste</h1>
                    <p className="text-slate-800 text-sm">Oversikt over alle registrerte kunder i systemet.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    + Ny kunde
                </button>
            </div>
            <CustomerTable />
        </div>
    );
}
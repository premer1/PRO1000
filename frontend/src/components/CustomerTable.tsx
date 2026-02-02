import { useState, useEffect } from 'react';

// Kunde
interface Customer {
    customerNumber: string;
    name: string;
    email: string;
    phone: string;
}

export default function CustomerTable() {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // Simuler henting av data fra backend
    useEffect(() => {
        // fetch('http://localhost:5000/api/customers')
        const mockData: Customer[] = [
            { customerNumber: "1001", name: "Ola Nordmann", email: "ola@bedrift.no", phone: "990 01 122" },
            { customerNumber: "1002", name: "Kari Jensen", email: "kari@design.no", phone: "445 56 677" },
            { customerNumber: "1003", name: "Bernt Hansen", email: "bernt@it-service.com", phone: "900 11 223" },
        ];

        setTimeout(() => {
            setCustomers(mockData);
            setLoading(false);
        }, 500); // forsinkelse for å simulere nettverk
    }, []);

    return (
        <div className="space-y-6">
            {/* Tabell-container */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Kundenr</th>
                        <th className="px-6 py-4 font-semibold">Navn</th>
                        <th className="px-6 py-4 font-semibold">E-post</th>
                        <th className="px-6 py-4 font-semibold">Telefon</th>
                        <th className="px-6 py-4 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                                Laster inn kunder...
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.customerNumber} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 text-sm font-mono text-blue-400">{customer.customerNumber}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{customer.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{customer.phone}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-500 hover:text-white text-xs font-medium">Rediger</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
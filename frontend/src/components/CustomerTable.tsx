import { useState, useEffect } from 'react';

interface PageRespons<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

interface Customer {
    customerNo: string;
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export default function CustomerTable() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:8080/api/customers?page=0&size=10");

                if (!res.ok) {
                    throw new Error("Kunne ikke koble til serveren");
                }

                const json = (await res.json()) as PageRespons<Customer>;

                // setter 'json.content' i state, fordi det er der selve listen bor
                setCustomers(json.content);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Noe gikk galt");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (error) {
        return <div className="p-6 text-red-500 bg-red-900/20 rounded-lg">Feil: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Kundenr</th>
                        <th className="px-6 py-4 font-semibold">Bedrift</th>
                        <th className="px-6 py-4 font-semibold">Navn</th>
                        <th className="px-6 py-4 font-semibold">Etternavn</th>
                        <th className="px-6 py-4 font-semibold">E-post</th>
                        <th className="px-6 py-4 font-semibold">Telefon</th>
                        <th className="px-6 py-4 font-semibold"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                                Henter data fra API...
                            </td>
                        </tr>
                    ) : customers.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                Ingen kunder funnet i databasen.
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.customerNo} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 text-sm font-mono text-blue-400">{customer.customerNo}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.companyName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.firstName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.lastName}</td>
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
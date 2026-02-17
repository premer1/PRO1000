import { useState, useEffect } from 'react';

interface PageRespons<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

interface Customer {
    id: number;
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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        customerNo: '',
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

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

    const openEditModal = (customer: Customer) => {
        setEditingCustomerId(customer.id);
        setEditForm({
            customerNo: customer.customerNo,
            companyName: customer.companyName,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
        });
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        if (saving) return;
        setIsEditOpen(false);
        setEditingCustomerId(null);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomerId === null) return;

        try {
            setSaving(true);
            const response = await fetch(`http://localhost:8080/api/customers/${editingCustomerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                let msg = 'Kunne ikke oppdatere kunde';
                try {
                    const err = (await response.json()) as { message?: string };
                    if (err.message) msg = err.message;
                } catch {
                    const text = await response.text();
                    if (text) msg = text;
                }
                throw new Error(msg);
            }

            const updatedCustomer = (await response.json()) as Customer;
            setCustomers((prev) =>
                prev.map((customer) =>
                    customer.id === updatedCustomer.id ? updatedCustomer : customer
                )
            );
            closeEditModal();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Kunne ikke oppdatere kunde');
        } finally {
            setSaving(false);
        }
    };

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
                            <td colSpan={7} className="px-6 py-10 text-center text-slate-500 italic">
                                Henter data fra API...
                            </td>
                        </tr>
                    ) : customers.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                                Ingen kunder funnet i databasen.
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 text-sm font-mono text-blue-400">{customer.customerNo}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.companyName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.firstName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{customer.lastName}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{customer.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{customer.phone}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="text-slate-500 hover:text-white text-xs font-medium"
                                        onClick={() => openEditModal(customer)}
                                    >
                                        Rediger
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Rediger kunde</h2>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Kundenummer</label>
                                    <input
                                        required
                                        value={editForm.customerNo}
                                        onChange={(e) => setEditForm({ ...editForm, customerNo: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Bedriftsnavn</label>
                                    <input
                                        required
                                        value={editForm.companyName}
                                        onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Fornavn</label>
                                    <input
                                        required
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Etternavn</label>
                                    <input
                                        required
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">E-post</label>
                                    <input
                                        required
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Telefon</label>
                                    <input
                                        required
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={saving}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                                >
                                    Avbryt
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                                >
                                    {saving ? 'Lagrer...' : 'Lagre endringer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

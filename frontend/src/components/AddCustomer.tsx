import { useState} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCustomerAdded: () => void;
}

export default function AddCustomer({ isOpen, onClose, onCustomerAdded }: ModalProps) {

    const [formData, setFormData] = useState({
        customerNo: '',
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    if (!isOpen) return null;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 3. RETTELSE: Endret fra {formDaa} til formData
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onCustomerAdded();
                onClose();
            } else {
                // Her fanger vi opp feilmeldinger for eksmple kundenummer under 1000
                const errorData = await response.json();
                alert("Feil: " + (errorData.message || "Kunne ikke lagre kunde"));
            }
        } catch (err) {
            alert("Kunne ikke kontakte serveren. Sjekk at Spring Boot kjører.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Legg til ny kunde</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Kundenummer</label>
                            <input
                                required
                                name="customerNo"
                                value={formData.customerNo}
                                onChange={e => setFormData({...formData, customerNo: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Bedriftsnavn</label>
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={e => setFormData({...formData, companyName: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Fornavn</label>
                            <input
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Etternavn</label>
                            <input
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">E-post</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Telefon</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Avbryt</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Lagre kunde</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
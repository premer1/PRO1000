import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription } from "@/components/ui/field";
import * as React from "react";
import { useEffect, useState } from "react";

interface CreateTicketsProps {
    showForm: boolean;
}

type Customer = {
    id: number;
    customerNo: string;
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

export function CreateTickets({ showForm }: CreateTicketsProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        async function loadCustomers() {
            try {
                const response = await fetch("http://localhost:8080/api/customers");

                if (!response.ok) {
                    throw new Error("Failed to fetch customers");
                }

                const data = await response.json();
                console.log("CUSTOMERS API:", data);
                console.log("CONTENT:", data.content);

                setCustomers(data.content ?? []);
            } catch (error) {
                console.error(error);
            }
        }

        if (showForm) {
            loadCustomers();
        }
    }, [showForm]);

    const filteredCustomers = customers.filter((customer) =>
        customer.companyName.toLowerCase().includes(customerSearch.toLowerCase())
    );

    async function createTickets(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formEl = e.currentTarget;
        const form = new FormData(formEl);

        try {
            const data = {
                customerId: selectedCustomer?.id ?? null,
                description: String(form.get("description") ?? ""),
                subject: String(form.get("subject") ?? ""),
                contactName: String(form.get("contactName") ?? ""),
                companyName: selectedCustomer?.companyName ?? "",
                email: String(form.get("email") ?? ""),
                phone: String(form.get("phone") ?? ""),
                status: String(form.get("status") ?? "OPEN"),
            };

            console.log("POST DATA:", data);

            const response = await fetch("http://localhost:8080/api/v1/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            formEl.reset();
            setCustomerSearch("");
            setSelectedCustomer(null);
        } catch (error) {
            console.error(error);
        }
    }

    if (!showForm) return null;

    return (
        <form className="bg-white w-fit p-6 mt-5 rounded-2xl" onSubmit={createTickets}>
            <Field className="mt-10 w-100">
                <FieldDescription>Søk kunde</FieldDescription>
                <Input
                    value={customerSearch}
                    onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setSelectedCustomer(null);
                    }}
                    placeholder="Skriv firmanavn..."
                />

                {customerSearch.trim() !== "" && (
                    <div className="mt-2 border rounded-2xl text-sm">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.slice(0, 8).map((customer) => (
                                <div
                                    key={customer.id}
                                    className="cursor-pointer border-b px-2 py-1 hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedCustomer(customer);
                                    }}
                                >
                                    {customer.companyName}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                Ingen treff
                            </div>
                        )}
                    </div>
                )}

                <FieldDescription>Firmanavn</FieldDescription>
                <Input
                    name="companyName"
                    value={selectedCustomer?.companyName ?? ""}
                    readOnly
                />

                <FieldDescription>Kontaktperson</FieldDescription>
                <Input name="contactName" />

                <FieldDescription>Emne</FieldDescription>
                <Input name="subject" />

                <FieldDescription>Beskrivelse</FieldDescription>
                <Textarea name="description" />

                <FieldDescription>E-post</FieldDescription>
                <Input name="email" />

                <FieldDescription>Telefon</FieldDescription>
                <Input name="phone" />

                <FieldDescription>Status</FieldDescription>
                <select
                    name="status"
                    defaultValue="OPEN"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="OPEN">Aktiv</option>
                    <option value="IN_PROGRESS">Pågår</option>
                    <option value="WAITING">Venter på oss</option>
                    <option value="CLOSED">Lukket</option>
                </select>

                <Button type="submit">Submit</Button>
            </Field>
        </form>
    );
}
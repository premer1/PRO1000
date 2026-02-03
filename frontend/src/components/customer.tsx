import {useEffect, useState} from "react";
import type { Customer, PageRespons } from "../types/customers.ts";

export function ListCustomers() {
    const [data, setData] = useState<PageRespons<Customer> | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch("http://localhost:8080/api/customers?page=0&size=10");
            const json = (await res.json()) as PageRespons<Customer>;
            setData(json);
        })();
    }, []);

    return (
        <div className="w-full">
            <div className="grid grid-cols-[.5fr_1fr_1fr_1fr_0.5fr] gap-4 px-4 py-2 text-sm text-black border-b border-black/10">
                <div>Kundenr</div>
                <div>Firma</div>
                <div>Navn</div>
                <div>E-post</div>
                <div>Telefon</div>
            </div>

            <div className="divide-y divide-black/10">
                {data?.content.map((c) => (
                    <div
                        onClick={() => {}}
                        key={c.id}
                        className="grid grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] gap-4 px-4 py-3 text-sm hover:bg-black/5"
                    >
                        <div className="text-black/70">{c.customerNo}</div>
                        <div className="">
                            {c.firstName} {c.lastName}
                        </div>

                        <div className="truncate">{c.email}</div>
                        <div>{c.phone}</div>

                    </div>
                ))}
            </div>
        </div>
    );
}

import {ListCustomers} from "../components/AddCustomer.tsx";

export function Dashboard() {
    return (
        <>
            <div className="">
                <div className="flex justify-start pl-6 pt-4 h-12 bg-[#D6D8D4]">
                    <a className="text-xl text-nowrap">CRM Prosjekt</a>
                </div>
                <div className="grid grid-cols-[180px_1fr] h-screen">
                        <div className="bg-[#D6D8D4]">

                        </div>
                        <div className="border p-10 border-black/20">
                            <form className="pb-10">
                                <input className="p-2 px-4 rounded-xl ring-1 ring-black/20 outline-gray-200" placeholder="Søk etter kunde"></input>
                            </form>
                            <div className="text-3xl px-2 pb-10">Kundeliste</div>
                            <div className="h-122 w-200 bg-white border rounded-xl border-black/20">
                                <ListCustomers />
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}
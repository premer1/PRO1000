import { Link, useLocation } from "react-router-dom";
import '../index.css';


interface NavItem {
    label: string;
    path: string;
}


const navItems: NavItem[] = [
    { label: "DashboardT", path: "/" },
    { label: "Kunder", path: "/customers" },
    { label: "Saksliste", path: "/tickets"},
    { label: "Aktiviteter", path: "/activities" },
    { label: "Innstillinger", path: "/settings" },
];

export default function Sidebar() {
    const location = useLocation(); // For å vite hvilken side som er aktiv

    return (
        <div className="flex h-screen">
            <nav className="w-64 border-r text-xl flex flex-col">
                <div className="px-6 py-5 text-center text-lg font-semibold tracking-wide">
                    CRM-System
                </div>

                <ul className="flex flex-col gap-1 px-3 mt-4">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`block rounded-md px-4 py-2 text-center transition ${
                                    location.pathname === item.path
                                        ? "text-blue-600" // Aktiv farge
                                        : "hover:text-slate-500"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
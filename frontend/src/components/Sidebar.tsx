import { NavLink } from "react-router-dom";
import { primaryNavItems } from "@/lib/navigation";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav className="flex h-full flex-col px-4 py-4">
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200/80">CRM</p>
        <h1 className="mt-2 text-xl font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
          Support Hub
        </h1>
      </div>

      <div>
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Primærnavigasjon</p>
        <ul className="space-y-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-white/6 hover:text-white",
                    ].join(" ")
                  }
                >
                  <div className="rounded-md border border-white/10 bg-white/5 p-1.5 transition group-hover:border-white/20 group-hover:bg-white/10">
                    <Icon size={16} />
                  </div>
                  <span className="block">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

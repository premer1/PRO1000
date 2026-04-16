import { NavLink } from "react-router-dom";
import { primaryNavItems } from "@/lib/navigation";

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 md:hidden" aria-label="Primærnavigasjon">
      <div className="grid grid-cols-4 rounded-lg border border-slate-200 bg-white p-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold transition",
                  isActive ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.mobileLabel}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import Sidebar from "../components/Sidebar";
import { getPageMeta } from "../lib/navigation";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageMeta = getPageMeta(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--crm-bg)] text-[var(--crm-text)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-80 border-r border-[var(--crm-sidebar-border)] bg-[var(--crm-sidebar)] md:block">
          <Sidebar />
        </aside>

        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--crm-sidebar-border)] bg-[var(--crm-sidebar)] transition-transform duration-200 md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-end p-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              aria-label="Lukk navigasjon"
            >
              <X size={20} />
            </button>
          </div>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Lukk navigasjon"
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
            <div className="px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-md border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
                  aria-label="Åpne navigasjon"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{pageMeta.eyebrow}</p>
                  <h2 className="text-lg font-semibold text-slate-950">{pageMeta.title}</h2>
                  {pageMeta.description ? <p className="mt-1 max-w-2xl text-sm text-slate-500">{pageMeta.description}</p> : null}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 pb-24 sm:px-6 lg:px-8 lg:py-5 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

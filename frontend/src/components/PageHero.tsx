import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, description, actions, children }: PageHeroProps) {
  return (
    <section className="rounded-lg border border-[var(--crm-border)] bg-white p-4">
      <div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-700/80">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h1>
            {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
          </div>

          {actions ? <div className="flex flex-wrap gap-2 xl:justify-end">{actions}</div> : null}
        </div>

        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </section>
  );
}

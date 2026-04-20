import { ArrowRight, Headset, KeyRound, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginPageProps = {
  onUnlock: (code: string) => boolean;
};

type LoginLocationState = {
  from?: string;
};

const featureCards = [
  {
    title: "Kundespor",
    description: "Samle kontaktdata, historikk og ansvarlige i ett arbeidsrom.",
    icon: Headset,
  },
  {
    title: "Ticketflyt",
    description: "Fang opp nye saker, prioriter køen og følg status uten sidebytte.",
    icon: Ticket,
  },
  {
    title: "AI-støtte",
    description: "Bruk assistenten til å oppsummere saker og finne neste anbefalte steg.",
    icon: Sparkles,
  },
];

export default function LoginPage({ onUnlock }: LoginPageProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LoginLocationState | null;
  const destination = locationState?.from && locationState.from !== "/login" ? locationState.from : "/";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (onUnlock(code)) {
      setError("");
      navigate(destination, { replace: true });
      return;
    }

    setError("Koden er ugyldig. Prøv igjen.");
  }

  return (
    <div className="crm-auth-shell relative min-h-screen overflow-hidden px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="crm-auth-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="crm-auth-orb crm-auth-orb-one pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full" aria-hidden="true" />
      <div className="crm-auth-orb crm-auth-orb-two pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-[32px] border border-white/55 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.28)] sm:px-8 sm:py-10 lg:px-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-100/80">
              <ShieldCheck size={14} />
              Pro1000 CRM
            </div>

            <div className="mt-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-amber-200/80">Support Hub</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                Ett sted for kunder, tickets og oppfølging.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Landingssiden gir rask tilgang til CRM-systemet, mens arbeidsflaten bak holder oversikt over kundedata,
                supportkø og AI-assistert saksbehandling.
              </p>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {featureCards.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur">
                  <div className="inline-flex rounded-2xl bg-white/10 p-3 text-teal-200">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-4 rounded-[28px] border border-white/10 bg-white/6 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Arbeidsflate</p>
                <p className="mt-3 text-2xl font-semibold text-white">Dashboard</p>
                <p className="mt-2 text-sm text-slate-300">Kundesituasjon og ticketkø samlet i første visning.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Fokus</p>
                <p className="mt-3 text-2xl font-semibold text-white">Prioritert</p>
                <p className="mt-2 text-sm text-slate-300">Designet for raske beslutninger i et kompakt CRM-grensesnitt.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Tilgang</p>
                <p className="mt-3 text-2xl font-semibold text-white">Kodebeskyttet</p>
                <p className="mt-2 text-sm text-slate-300">Innloggingen huskes i nettleseren til brukeren logger ut.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/86 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,118,110,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--crm-accent-strong)]">
              <KeyRound size={14} />
              Autorisert tilgang
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950" style={{ fontFamily: "var(--font-display)" }}>
                Logg inn for å åpne CRM-systemet.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                Skriv inn tilgangskoden for å komme videre til Support Hub. Når koden er godkjent blir du sendt rett inn i CRM-et.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="crm-access-code" className="text-sm font-medium text-slate-700">
                  Tilgangskode
                </label>
                <Input
                  id="crm-access-code"
                  type="password"
                  value={code}
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Skriv inn tilgangskoden"
                  aria-invalid={error ? "true" : "false"}
                  className="h-12 rounded-2xl border-slate-200 bg-white text-base shadow-none"
                  onChange={(event) => {
                    setCode(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                />
              </div>

              {error ? (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                disabled={!code.trim()}
              >
                Åpne CRM
                <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Tilgangslogikk</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Innloggingen er bevisst enkel og hardkodet for prosjektbruk. Tilgangen beholdes lokalt i nettleseren til du velger å logge ut.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

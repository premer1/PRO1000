# Utfordringer og løsninger

## 1. Uferdige og inkonsistente API-er
- Utfordring: Kundemodulen hadde bare deler av CRUD-flyten, ticketmodulen støttet i praksis bare statusoppdatering, og frontend brukte en blanding av paginerte svar og rå entity-responser.
- Løsning: Jeg standardiserte backend med tydelige request-/response-objekter, fullførte CRUD for kunder og tickets, og la til dedikerte endepunkter for dashboard, notater og AI-assistanse.

## 2. Dashboard uten meningsfulle data
- Utfordring: Dashboardet bestod nesten bare av én komponent og ga ikke nok informasjon til en demo.
- Løsning: Jeg laget et aggregert dashboard-endepunkt som henter nøkkeltall, nylige tickets og kundeaktivitet, og la inn seed-data slik at systemet starter med demonstrerbart innhold når databasen er tom.

## 3. AI-kravet uten hardkodede secrets
- Utfordring: Prosjektet måtte ha en AI-funksjon integrert i produktet, men uten å være avhengig av hardkodede nøkler eller en skjør demo-knapp.
- Løsning: Jeg bygget en AI-ticketassistent på backend som bruker miljøvariabler for ekstern AI-provider, men har en innebygd fallback som fortsatt gir demonstrerbare forslag til oppsummering, prioritet, kategori og svarutkast dersom AI-tjenesten ikke er konfigurert.

## 4. Frontend med flere halvferdige flyter
- Utfordring: Flere eksisterende sider og komponenter fungerte delvis, men navigasjon, labels og helhetlig UX hang ikke sammen.
- Løsning: Jeg bygget en ny hovedflyt i frontend rundt dashboard, kunder, tickets og ticketdetaljer, og koblet den til backend via relative `/api`-kall slik at Vite-proxyen fungerer i lokal utvikling.

## 5. Maven-tester avhang av lokal Postgres
- Utfordring: `contextLoads` feilet først fordi testene prøvde å starte mot lokal PostgreSQL med autentisering, noe som gjør testene skjøre og miljøavhengige.
- Løsning: Jeg la inn et eget testoppsett med H2 i PostgreSQL-modus og testavhengigheter i `pom.xml`, slik at backend-testene kan kjøres isolert og reproduserbart.

## 6. Validering i sandbox og utenfor sandbox
- Utfordring: Maven trengte å laste ned testavhengigheter og skrive til lokal cache, noe som først stoppet i sandbox.
- Løsning: Jeg brukte vanlig kompilering for rask lokal verifisering, og kjørte deretter testene med utvidede rettigheter etter at testoppsettet var gjort isolert og stabilt.

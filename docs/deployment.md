# Deploy med ett domene

Prosjektet er satt opp for å kjøre frontend og backend i samme Spring Boot-app:

- React bygges til statiske filer.
- Spring Boot server disse filene fra `/`.
- Backend-API-et ligger fortsatt under `/api/**`.
- Frontend bruker relative API-kall, så `VITE_API_BASE_URL` skal normalt ikke settes i produksjon.

## Anbefalt rask løsning: Docker-hosting + Postgres

Bruk en hostingtjeneste som kan bygge `Dockerfile` fra repoet og tilby Postgres, for eksempel Railway, Render eller Fly.io.

Miljøvariabler som må settes i web-servicen:

```env
DB_URL=jdbc:postgresql://<host>:<port>/<database>
DB_USERNAME=<bruker>
DB_PASSWORD=<passord>
APP_SEED_DEMO_DATA=true
AI_API_KEY=<valgfritt>
AI_MODEL=gpt-4.1-mini
APP_CORS_ALLOWED_ORIGINS=https://<frontend-domenet>
APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://*.up.railway.app
```

Ikke sett `VITE_API_BASE_URL` når frontend og backend ligger på samme domene.

Hvis frontend og backend ligger på ulike Railway-domener, må backend tillate
frontend-originen. Bruk `APP_CORS_ALLOWED_ORIGINS` for eksakte domener, for
eksempel `https://crm.example.no`. Standardoppsettet tillater også Railway sine
genererte `https://*.up.railway.app`-domener via `APP_CORS_ALLOWED_ORIGIN_PATTERNS`.

## Sjekkliste

1. Push endringene til GitHub.
2. Opprett en Postgres-database hos valgt hostingtjeneste.
3. Opprett en web-service fra repoet og velg Dockerfile-build.
4. Legg inn miljøvariablene over.
5. Deploy web-servicen.
6. Test `https://<domenet>/api/health`.
7. Åpne `https://<domenet>/` og logg inn med presentasjonskoden.

Hvis databaseleverandøren gir en URL som starter med `postgresql://`, må den gjøres om til JDBC-format: `jdbc:postgresql://...`.

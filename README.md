# MPLADS-SIH-26

MPLADS project-risk monitoring dashboard. The Vite UI loads all dashboard, work, MP and ML-risk values from the Node/PostgreSQL backend; it does not fall back to display mock records.

## Run locally

Start PostgreSQL, initialise the schema, and import the stored scoring data:

```powershell
docker compose up -d
cd backend
Copy-Item .env.example .env
npm install
npm run db:init
npm run db:seed-demo
npm run dev
```

In another terminal, start the UI:

```powershell
npm install
npm run dev
```

Open http://localhost:5173. The UI calls `/api/ui-data` through Vite's proxy; this endpoint returns the PostgreSQL-backed work directory, aggregates, persisted ML risk scores, and model-data status. `/api/ml/status` is available for a lightweight scoring-data health check.

To retrain the included ML artifacts, install the ML dependencies once and run `npm run ml:install` followed by `npm run ml:train` from `backend`.

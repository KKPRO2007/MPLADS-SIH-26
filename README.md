# MPLADS-SIH-26

MPLADS project-risk monitoring dashboard with a Next.js frontend and FastAPI API.

## Run locally

Start the API in one terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Start the dashboard in another terminal:

```powershell
cd ui
npm install
npm run dev
```

Open http://localhost:3000. The API health check is available at http://localhost:8000/health.

For the included demo login, use `admin` / `change-me`. Set `NEXT_PUBLIC_API_URL` if the API is hosted anywhere other than `http://localhost:8000`.

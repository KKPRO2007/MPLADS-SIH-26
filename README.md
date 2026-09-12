# MPLADS AI-Powered Monitoring Platform

## Problem Statement 26102

Developed by **Enzo Team** for the Smart India Hackathon problem statement:

> Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation.

This project is a decision-support platform for monitoring MPLADS fund utilization, sanctioned works, project execution, asset progress, and risk indicators. It is designed for Members of Parliament, State Nodal Authorities, District Authorities, and the Ministry of Statistics and Programme Implementation (MoSPI).

## What We Made

The platform brings financial, physical-progress, and anomaly information into one monitoring workflow:

- **National Overview**: sanctioned amount, expenditure, utilization rate, completed works, and active risk alerts.
- **AI Risk Monitoring**: searchable risk alerts with risk scores, anomaly types, detection rationale, and recommended administrative action.
- **Work Progress and Asset Directory**: work-level search, execution status, sanctioned cost, disbursement, physical progress, and detailed inspection view.
- **MP Performance Directory**: MP-wise sanctioned amount, utilization rate, completed works, open alerts, and risk level.
- **State Explorer**: state and Union Territory comparison for sanctions, expenditure, unspent balances, flagged works, and risk trends.
- **Sector Analytics**: sector-wise allocation, utilization, work counts, and completed asset indicators.
- **Fund Flow View**: fund movement and state-level sanctioned, utilized, and unspent comparisons.
- **Citizen Corner and Reports**: citizen work recommendations and constituency audit report generation.
- **Accessibility controls**: skip navigation, font-size controls, contrast modes, keyboard-friendly navigation, and responsive layouts.

## How the AI Risk Layer Works

Each work can be evaluated using signals such as:

- Difference between planned and physical progress.
- Cost deviation from expected or district-level patterns.
- Project delay duration.
- Unspent or under-utilized fund ratio.
- Stored anomaly classification from the processed dataset.

The backend converts these signals into a risk score from 0 to 100. The interface groups scores into Low, Medium, and High risk levels. Officers can open an alert to review the explanation, issue a district inquiry, or mark the alert as reviewed.

The platform is intended to support investigation. A risk alert is not a finding of fraud and must be verified against official records, field evidence, and applicable MPLADS rules.

## Technology Used

### Frontend

- React 18
- Vite
- Tailwind CSS
- Recharts for fund, sector, and progress visualizations
- Lucide React for interface icons

### Backend and Data

- Node.js with Express
- PostgreSQL
- `pg` for database access
- `csv-parse` for importing the processed MPLADS dataset
- Vite development proxy from `/api` to the backend on port `8080`

### ML and Analytics

- Python training and feature scripts under `backend/ml/src`
- Joblib model artifacts under `backend/ml/models`
- CSV metrics under `backend/ml/reports`
- FastAPI, SQLAlchemy, Pydantic Settings, and Uvicorn dependencies are available for the Python service layer

## Architecture

```text
Processed MPLADS CSV / PostgreSQL
							|
							v
		 Express REST API (:8080)
							|
							v
			 React + Vite UI (:5173)
							|
							v
 Dashboards, risk alerts, reports, and work inspection views
```

The frontend requests live records from `/api/ui-data` and `/api/dashboard`. When PostgreSQL is unavailable, the Node service uses the bundled processed dataset as a clearly labelled fallback so the prototype can still be demonstrated. Seeded database records are marked as synthetic demo data and must not be treated as official government records.

## Project Structure

```text
src/
	App.jsx                  Application routing and data loading
	components/              Header, alert drawer, charts, modals, and shared UI
	pages/                   Overview, risk, fund, state, sector, work, and citizen views
	data/mockData.js          Prototype-only static data used by legacy standalone pages
backend/
	server.js                Express API and bundled-data fallback
	db/schema.sql             PostgreSQL schema
	db/database.js            PostgreSQL connection pool
	scripts/                  Database initialization and demo-data import
	ml/src/                   Feature, training, and explanation scripts
	ml/models/                Trained binary and multiclass model artifacts
	ml/reports/               Model evaluation metrics
	ml/data/                  Raw and processed datasets
```

## Run Locally

### Prerequisites

- Node.js 18 or later
- PostgreSQL 14 or later
- Python 3.10 or later for ML retraining

### 1. Configure PostgreSQL

Create a database and set the connection string in the backend environment. From PowerShell:

```powershell
cd backend
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/mplads"
$env:DATABASE_SSL = "false"
```

For repeated use, place these values in a local `backend/.env` file. Do not commit credentials.

### 2. Initialize and seed the database

```powershell
cd backend
npm install
npm run db:init
npm run db:seed-demo
```

The seed command imports the processed dataset and calculates persisted demo risk scores. Its output is intentionally labelled synthetic demo data.

### 3. Start the backend

```powershell
cd backend
npm run dev
```

The API runs at `http://localhost:8080`.

### 4. Start the frontend

In a second terminal:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

- `GET /health` - database and record-count health check.
- `GET /api/dashboard` - home-page statistics and state progress summary.
- `GET /api/ui-data` - overview KPIs, trend data, works, alerts, MP profiles, and status stages.
- `GET /api/ml/status` - scoring-data availability and record count.

## ML Retraining

From the `backend` directory, create a Python virtual environment and install the ML dependencies:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r ml\requirements.txt
```

Run the training workflow:

```powershell
.\.venv\Scripts\python.exe ml\src\train.py
```

The generated model artifacts and reports are written to `backend/ml/models` and `backend/ml/reports`. Review model metrics and validate against an approved, representative dataset before using the scores operationally.

## Verification

Build the frontend with:

```powershell
npm run build
```

The current frontend build completes successfully. Production deployment should additionally verify PostgreSQL connectivity, API responses, dataset provenance, authentication, authorization, audit logging, and official data-sharing requirements.

## Data and Governance Note

The public MPLADS dashboard is the referenced data source for this prototype: <https://mplads.mospi.gov.in/digigov/dashboard.html>.

This repository contains prototype and demo components. Before production use, replace demo records with authorized source data, apply role-based access controls, protect personal and administrative information, retain an audit trail for decisions, and require human review for every high-risk alert.

## Team

**Enzo Team**

MPLADS-SIH-26 | Smart India Hackathon 2026 | Problem Statement 26102

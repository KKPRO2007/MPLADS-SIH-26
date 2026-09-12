CREATE TABLE IF NOT EXISTS works (
  project_id TEXT PRIMARY KEY,
  mp_name TEXT,
  house TEXT,
  state TEXT NOT NULL,
  constituency TEXT,
  district TEXT,
  project_type TEXT,
  recommendation_start_date DATE,
  snapshot_date DATE,
  sanctioned_amount_inr NUMERIC(16,2) NOT NULL DEFAULT 0,
  released_amount_inr NUMERIC(16,2) NOT NULL DEFAULT 0,
  expenditure_amount_inr NUMERIC(16,2) NOT NULL DEFAULT 0,
  physical_progress_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  delay_days INTEGER NOT NULL DEFAULT 0,
  completion_status TEXT,
  description TEXT,
  is_anomaly BOOLEAN NOT NULL DEFAULT FALSE,
  anomaly_type TEXT,
  risk_score INTEGER NOT NULL DEFAULT 0,
  data_source TEXT NOT NULL DEFAULT 'verified',
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS works_state_idx ON works(state);
CREATE INDEX IF NOT EXISTS works_risk_idx ON works(risk_score DESC);

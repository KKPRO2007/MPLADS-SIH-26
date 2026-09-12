import csv
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parents[1] / "ml" / "data" / "processed" / "MPLADS_master_dataset_26102_cleaned.csv"
MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "models"


def _risk_score(row: dict[str, str]) -> int:
    progress_gap = _number(row, "progress_gap_pct")
    cost_deviation = _number(row, "cost_deviation_pct")
    delay_days = _number(row, "delay_days")
    unspent_ratio = _number(row, "unspent_ratio")
    return min(100, round(
        min(abs(progress_gap), 50) * 1.1
        + min(abs(cost_deviation), 50) * 0.7
        + min(delay_days / 30, 20) * 1.2
        + min(unspent_ratio * 100, 30) * 0.5,
    ))


def _risk(row: dict[str, str]) -> str:
    anomaly_type = row.get("anomaly_type", "none")
    if anomaly_type in {"cost_overrun", "progress_gap", "duplicate_work"}:
        return "high"
    if _risk_score(row) >= 70:
        return "high"
    if anomaly_type in {"stalled_work", "fund_unutilized", "payment_anomaly", "rule_flagged_other"}:
        return "medium"
    if _risk_score(row) >= 40:
        return "medium"
    return "low"


def _number(row: dict[str, str], field: str) -> float:
    """Read a numeric CSV field without allowing malformed source data to break the API."""
    try:
        return float(row.get(field) or 0)
    except (TypeError, ValueError):
        return 0.0


def _prediction(row: dict[str, str]) -> dict[str, Any]:
    """Format the anomaly-model output into a UI-ready, explainable alert.

    The processed dataset is the model scoring output used by the dashboard.  We
    keep the raw anomaly class intact and expose the operational indicators that
    explain why a work needs review.
    """
    anomaly_type = row.get("anomaly_type", "none") or "none"
    anomaly_detected = str(row.get("is_anomaly", "0")).strip() in {"1", "true", "True"}
    progress_gap = _number(row, "progress_gap_pct")
    cost_deviation = _number(row, "cost_deviation_pct")
    delay_days = _number(row, "delay_days")
    unspent_ratio = _number(row, "unspent_ratio")
    score = _risk_score(row)
    signals = []
    if abs(progress_gap) >= 15:
        signals.append(f"{abs(progress_gap):.1f}% progress gap")
    if abs(cost_deviation) >= 10:
        signals.append(f"{abs(cost_deviation):.1f}% cost deviation")
    if delay_days >= 90:
        signals.append(f"{delay_days:,.0f} days delayed")
    if unspent_ratio >= 0.25:
        signals.append(f"{unspent_ratio * 100:.1f}% funds unspent")
    action_by_type = {
        "cost_overrun": "Validate estimates, expenditure and revised sanction.",
        "progress_gap": "Request a physical-progress update and recovery plan.",
        "duplicate_work": "Check the work scope against nearby sanctioned projects.",
        "stalled_work": "Escalate for a site-status review and completion timeline.",
        "fund_unutilized": "Review release utilisation and pending payment milestones.",
        "payment_anomaly": "Audit payment vouchers and beneficiary/vendor records.",
        "rule_flagged_other": "Send the work for programme officer review.",
    }
    return {
        "anomaly_detected": anomaly_detected,
        "predicted_anomaly_type": anomaly_type,
        "risk_level": _risk(row).title(),
        "risk_score": score,
        "signals": signals or ["No material risk signal detected"],
        "recommended_action": action_by_type.get(anomaly_type, "Continue routine monitoring."),
    }


@lru_cache(maxsize=1)
def load_rows() -> tuple[dict[str, str], ...]:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"ML dataset not found at {DATA_PATH}")
    with DATA_PATH.open(encoding="utf-8-sig", newline="") as handle:
        return tuple(csv.DictReader(handle))


def _state_rows() -> list[dict[str, Any]]:
    grouped: dict[str, dict[str, Any]] = {}
    for row in load_rows():
        name = row.get("state", "Unknown").strip().title()
        bucket = grouped.setdefault(name, {"name": name, "total": 0, "high": 0, "medium": 0, "low": 0})
        bucket["total"] += 1
        bucket[_risk(row)] += 1
    result = []
    for state in grouped.values():
        dominant = max(("high", "medium", "low"), key=lambda level: state[level])
        result.append({**state, "dominant": dominant, "anomaly_rate": round((state["high"] + state["medium"]) / state["total"], 4)})
    return sorted(result, key=lambda state: state["name"])


def summary(state: str | None = None, risk: str | None = None) -> dict[str, int]:
    counts = {"total": 0, "high": 0, "medium": 0, "low": 0}
    for row in load_rows():
        row_risk = _risk(row)
        if state and state.lower() != "all states" and row.get("state", "").strip().casefold() != state.strip().casefold():
            continue
        if risk and risk.lower() != "all" and row_risk != risk.lower():
            continue
        counts["total"] += 1
        counts[row_risk] += 1
    return counts


def risks(limit: int = 12, state: str | None = None, risk: str | None = None) -> list[dict[str, Any]]:
    flagged: dict[str, dict[str, Any]] = {}
    for row in load_rows():
        row_risk = _risk(row)
        if row_risk == "low":
            continue
        if state and state.lower() != "all states" and row.get("state", "").strip().casefold() != state.strip().casefold():
            continue
        if risk and risk.lower() != "all" and row_risk != risk.lower():
            continue
        prediction = _prediction(row)
        item = {
            "id": row.get("project_id"),
            "project": row.get("description") or row.get("project_id"),
            "location": f"{row.get('district', 'Unknown')}, {row.get('state', 'Unknown')}",
            "state": row.get("state", "Unknown"),
            "district": row.get("district", "Unknown"),
            "sanctioned_amount_inr": _number(row, "sanctioned_amount_inr"),
            "expenditure_amount_inr": _number(row, "expenditure_amount_inr"),
            **prediction,
        }
        key = str(item["id"] or f"{item['project']}|{item['location']}")
        existing = flagged.get(key)
        if existing is None or item["risk_score"] > existing["risk_score"]:
            flagged[key] = item
    return sorted(flagged.values(), key=lambda item: item["risk_score"], reverse=True)[:limit]


def model_status() -> dict[str, Any]:
    return {"binary_model": (MODEL_PATH / "binary_model.joblib").exists(), "multiclass_model": (MODEL_PATH / "multiclass_model.joblib").exists(), "dataset": DATA_PATH.exists(), "rows": len(load_rows())}

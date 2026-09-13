from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
import shap

from ml.src.features import build_features

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "ml" / "data" / "processed" / "MPLADS_master_dataset_26102_cleaned.csv"
MODEL_DIR = BASE_DIR / "ml" / "models"

FEATURE_LABELS = {
    "sanctioned_amount_inr": "Sanctioned project amount",
    "expenditure_amount_inr": "Expenditure against sanction",
    "payment_count": "Number of payments",
    "delay_days": "Delay beyond expected timeline",
    "cost_deviation_pct": "Cost deviation from sanctioned amount",
    "progress_gap_pct": "Physical progress vs. spending gap",
    "fund_utilization_pct": "Percentage of funds utilized",
    "unspent_ratio": "Proportion of sanctioned funds unspent",
    "peer_cost_zscore": "Cost compared to similar projects",
    "peer_progress_zscore": "Progress compared to similar projects",
    "completion_efficiency_score": "Overall completion efficiency",
    "mp_completion_efficiency_avg": "MP completion efficiency",
    "state_completion_efficiency_avg": "State completion efficiency",
    "payment_velocity_per_30d": "Payment release speed",
    "early_payment_share": "Share of payments released early",
    "sanction_to_release_days": "Time from sanction to fund release",
    "recommendation_to_sanction_days": "Time from recommendation to sanction",
    "mp_allocated_amount_inr": "MP allocated amount",
    "latitude": "Project latitude",
    "longitude": "Project longitude",
    "vendor_project_count": "Number of projects with this vendor",
    "desc_similarity_max": "Similarity to another recommended project",
    "desc_template_freq": "Frequency of similar project description",
    "project_type_enc": "Project category",
    "state_enc": "State comparison group",
    "house_enc": "Parliamentary house",
}


def _risk_level(score: float) -> str:
    if score >= 70:
        return "High"
    if score >= 40:
        return "Medium"
    return "Low"


def _class_name(value: str) -> str:
    return str(value).strip().lower().replace(" ", "_")


def _positive_class_index(classes: Any) -> int:
    names = [str(value).lower() for value in classes]
    for candidate in ("1", "true", "anomaly"):
        if candidate in names:
            return names.index(candidate)
    return min(1, len(names) - 1)


def _binary_shap_values(explainer: Any, features: pd.DataFrame) -> np.ndarray:
    values = explainer.shap_values(features)
    if isinstance(values, list):
        return np.asarray(values[min(1, len(values) - 1)])[0]
    values = np.asarray(values)
    if values.ndim == 3:
        return values[0, :, min(1, values.shape[2] - 1)]
    return values[0]


@lru_cache(maxsize=1)
def load_model_bundle() -> dict[str, Any]:
    raw = pd.read_csv(DATA_PATH)
    binary_saved = joblib.load(MODEL_DIR / "binary_model.joblib")
    multiclass_saved = joblib.load(MODEL_DIR / "multiclass_model.joblib")
    feature_frame, feature_cols = build_features(raw)
    binary_features = binary_saved["feature_cols"]
    multiclass_features = multiclass_saved["feature_cols"]
    if feature_cols != binary_features or feature_cols != multiclass_features:
        raise RuntimeError("Saved model feature columns do not match the feature builder.")
    binary_model = binary_saved["model"]
    multiclass_model = multiclass_saved["model"]
    all_binary_features = feature_frame.loc[:, feature_cols]
    positive_index = _positive_class_index(binary_model.classes_)
    binary_probabilities = binary_model.predict_proba(all_binary_features)[:, positive_index]
    ranked_indexes = sorted(range(len(raw)), key=lambda index: (-float(binary_probabilities[index]), str(raw.iloc[index]["project_id"])))
    denominator = max(1, len(ranked_indexes) - 1)
    display_scores = {
        str(raw.iloc[index]["project_id"]): round(96 - (rank / denominator) * 76, 3)
        for rank, index in enumerate(ranked_indexes)
    }
    return {
        "raw": raw,
        "features": feature_frame,
        "feature_cols": feature_cols,
        "binary": binary_model,
        "multiclass": multiclass_model,
        "class_names": list(multiclass_saved["class_names"]),
        "binary_explainer": shap.TreeExplainer(binary_model),
        "binary_probabilities": binary_probabilities,
        "display_scores": display_scores,
    }


def warm_models() -> None:
    load_model_bundle()


def _top_features(bundle: dict[str, Any], feature_row: pd.DataFrame) -> list[dict[str, Any]]:
    values = _binary_shap_values(bundle["binary_explainer"], feature_row)
    items = []
    for feature, impact in zip(bundle["feature_cols"], values):
        numeric_impact = float(impact)
        items.append({
            "feature": feature,
            "label": FEATURE_LABELS.get(feature, feature.replace("_", " ").capitalize()),
            "impact": round(numeric_impact, 4),
            "direction": "increased" if numeric_impact >= 0 else "decreased",
        })
    return sorted(items, key=lambda item: abs(item["impact"]), reverse=True)[:5]


def predict_project(project_id: str) -> dict[str, Any]:
    bundle = load_model_bundle()
    raw = bundle["raw"]
    matches = raw.index[raw["project_id"].astype(str) == str(project_id)].tolist()
    if not matches:
        raise KeyError(project_id)
    row_index = matches[0]
    feature_row = bundle["features"].loc[[row_index], bundle["feature_cols"]]
    binary_model = bundle["binary"]
    multiclass_model = bundle["multiclass"]
    binary_probability = float(bundle["binary_probabilities"][row_index])
    score = bundle["display_scores"][str(project_id)]
    distribution_values = multiclass_model.predict_proba(feature_row)[0]
    class_names = bundle["class_names"]
    distribution = {_class_name(name): round(float(probability), 6) for name, probability in zip(class_names, distribution_values)}
    predicted_type, confidence = max(distribution.items(), key=lambda item: item[1])
    top_features = _top_features(bundle, feature_row)
    positive = [item["label"].lower() for item in top_features if item["direction"] == "increased"][:2]
    negative = [item["label"].lower() for item in top_features if item["direction"] == "decreased"][:1]
    why = "Flagged primarily because " + (", ".join(positive) if positive else "the model detected a combined risk pattern")
    if negative:
        why += ", while " + " and ".join(negative) + " reduced the risk contribution"
    why += "."
    return {
        "project_id": str(project_id),
        "risk_score": score,
        "model_probability": round(binary_probability, 6),
        "risk_level": _risk_level(score),
        "predicted_anomaly_type": predicted_type,
        "anomaly_type_confidence": round(float(confidence), 4),
        "top_features": top_features,
        "anomaly_type_distribution": distribution,
        "why_flagged": why,
    }


def project_ids() -> list[str]:
    return [str(value) for value in load_model_bundle()["raw"]["project_id"].tolist()]

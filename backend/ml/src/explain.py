"""
ml/src/explain.py
SHAP explainability for the trained binary (is_anomaly) and multiclass (anomaly_type) models.

Run:
    python src/explain.py

Reads:
    data/processed/MPLADS_master_dataset_26102_cleaned.csv
    models/binary_model.joblib
    models/multiclass_model.joblib
Writes:
    reports/shap_summary_binary.png
    reports/shap_summary_multiclass.png
"""

import os
import joblib
import numpy as np
import pandas as pd
import shap
import matplotlib.pyplot as plt

from features import build_features

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # ml/
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "MPLADS_master_dataset_26102_cleaned.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


def explain_binary(df, sample_size=800):
    print("Loading binary model...")
    saved = joblib.load(os.path.join(MODELS_DIR, "binary_model.joblib"))
    model = saved["model"]
    feature_cols = saved["feature_cols"]  # use the SAME feature list the model was trained on

    # Sample for speed — a summary plot only needs a representative sample,
    # not all 26k rows. Running SHAP on a 400-tree RandomForest over the full
    # dataset can take a very long time.
    df_sample = df.sample(n=min(sample_size, len(df)), random_state=42)
    X = df_sample[feature_cols]

    print(f"Computing SHAP values for binary model (Random Forest) on a sample of {len(X)} rows...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)

    # RandomForest binary classifier -> shap_values is a list [class_0, class_1]
    shap_vals_anomaly = shap_values[1] if isinstance(shap_values, list) else shap_values

    plt.figure()
    shap.summary_plot(shap_vals_anomaly, X, show=False)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "shap_summary_binary.png"), dpi=150)
    plt.close()
    print(f"Saved -> reports/shap_summary_binary.png")

    return explainer, feature_cols


def explain_multiclass(df, sample_size=800):
    print("Loading multiclass model...")
    saved = joblib.load(os.path.join(MODELS_DIR, "multiclass_model.joblib"))
    model = saved["model"]
    feature_cols = saved["feature_cols"]
    class_names = saved["class_names"]

    df_sample = df.sample(n=min(sample_size, len(df)), random_state=42)
    X = df_sample[feature_cols]

    print(f"Computing SHAP values for multiclass model (LightGBM) on a sample of {len(X)} rows...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)

    plt.figure()
    shap.summary_plot(shap_values, X, class_names=class_names, show=False)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "shap_summary_multiclass.png"), dpi=150)
    plt.close()
    print(f"Saved -> reports/shap_summary_multiclass.png")

    return explainer, feature_cols


def explain_single_project(explainer, X_row, feature_names):
    """Reason for ONE project's prediction — this logic will later power the dashboard's 'why is this risky' text."""
    shap_values = explainer.shap_values(X_row)

    if isinstance(shap_values, list):
        # Older SHAP: list of arrays, one per class -> [class_0_array, class_1_array]
        vals = shap_values[1][0]
    else:
        arr = np.array(shap_values)
        if arr.ndim == 3:
            # Newer SHAP: shape (n_samples, n_features, n_classes) -> take class 1 (anomaly)
            vals = arr[0, :, 1]
        else:
            # shape (n_samples, n_features)
            vals = arr[0]

    vals = np.ravel(vals)  # safety: force to a flat 1D array of per-feature scalars

    contributions = sorted(
        zip(feature_names, vals),
        key=lambda x: abs(x[1]),
        reverse=True
    )
    print("\nTop reasons for this project's risk score:")
    for feat, val in contributions[:5]:
        direction = "increased" if val > 0 else "decreased"
        print(f"  {feat}: {direction} risk (impact: {val:.4f})")


def main():
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)

    print("Building features (must match training exactly)...")
    df, _ = build_features(df)

    binary_explainer, binary_feature_cols = explain_binary(df)
    explain_multiclass(df)

    print("\n--- Example: explaining a single project's prediction (row 0) ---")
    explain_single_project(binary_explainer, df[binary_feature_cols].iloc[[0]], binary_feature_cols)


if __name__ == "__main__":
    main()
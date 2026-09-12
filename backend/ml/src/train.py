"""
ml/src/train.py
FINAL model training — binary (is_anomaly) + multiclass (anomaly_type).
LEAKAGE-FIXED: split happens BEFORE feature engineering (see features.py notes).

Run:
    python src/train.py
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, classification_report, confusion_matrix,
)
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import lightgbm as lgb

from features import build_features_split

RANDOM_STATE = 42
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "MPLADS_master_dataset_26102_cleaned.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)


def train_binary(train_df, test_df, feature_cols):
    X_train, y_train = train_df[feature_cols], train_df["is_anomaly"]
    X_test, y_test = test_df[feature_cols], test_df["is_anomaly"]

    model = RandomForestClassifier(
        n_estimators=400, random_state=RANDOM_STATE, class_weight="balanced", n_jobs=-1
    )
    model.fit(X_train, y_train)

    probs = model.predict_proba(X_test)[:, 1]
    preds = (probs >= 0.5).astype(int)

    metrics = {
        "accuracy": accuracy_score(y_test, preds),
        "precision": precision_score(y_test, preds),
        "recall": recall_score(y_test, preds),
        "f1": f1_score(y_test, preds),
        "roc_auc": roc_auc_score(y_test, probs),
    }

    print("\n=== BINARY (is_anomaly) — RandomForest [leakage-fixed] ===")
    for k, v in metrics.items():
        print(f"{k:>10}: {v:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, preds, target_names=["normal", "anomaly"]))
    print("Confusion matrix:")
    print(confusion_matrix(y_test, preds))

    pd.DataFrame([metrics]).to_csv(os.path.join(REPORTS_DIR, "binary_metrics.csv"), index=False)
    joblib.dump({"model": model, "feature_cols": feature_cols}, os.path.join(MODELS_DIR, "binary_model.joblib"))
    print(f"\nSaved -> models/binary_model.joblib, reports/binary_metrics.csv")
    return model


def train_multiclass(train_df, test_df, feature_cols):
    le_target = LabelEncoder()
    le_target.fit(pd.concat([train_df["anomaly_type"], test_df["anomaly_type"]]))
    class_names = le_target.classes_

    X_train = train_df[feature_cols]
    y_train = le_target.transform(train_df["anomaly_type"])
    X_test = test_df[feature_cols]
    y_test = le_target.transform(test_df["anomaly_type"])

    model = lgb.LGBMClassifier(
        random_state=RANDOM_STATE, verbose=-1, class_weight="balanced",
        n_estimators=400, objective="multiclass", num_class=len(class_names),
    )
    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    metrics = {
        "accuracy": accuracy_score(y_test, preds),
        "precision_macro": precision_score(y_test, preds, average="macro", zero_division=0),
        "recall_macro": recall_score(y_test, preds, average="macro", zero_division=0),
        "f1_macro": f1_score(y_test, preds, average="macro", zero_division=0),
        "f1_weighted": f1_score(y_test, preds, average="weighted", zero_division=0),
    }

    print("\n=== MULTICLASS (anomaly_type, 8 classes) — LightGBM [leakage-fixed] ===")
    for k, v in metrics.items():
        print(f"{k:>16}: {v:.4f}")
    print("\nPer-class report:")
    print(classification_report(y_test, preds, target_names=class_names, zero_division=0))

    pd.DataFrame([metrics]).to_csv(os.path.join(REPORTS_DIR, "multiclass_metrics.csv"), index=False)
    joblib.dump(
        {"model": model, "feature_cols": feature_cols, "class_names": list(class_names)},
        os.path.join(MODELS_DIR, "multiclass_model.joblib"),
    )
    print(f"\nSaved -> models/multiclass_model.joblib, reports/multiclass_metrics.csv")
    return model


def main():
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)

    print("Splitting FIRST (before feature engineering) to prevent leakage...")
    train_raw, test_raw = train_test_split(
        df, test_size=0.2, random_state=RANDOM_STATE, stratify=df["is_anomaly"]
    )

    print("Building features (fit on train, applied to test — ~1-2 min)...")
    train_df, test_df, feature_cols = build_features_split(train_raw, test_raw)
    print(f"Feature count: {len(feature_cols)}")
    print(feature_cols)

    train_binary(train_df, test_df, feature_cols)
    train_multiclass(train_df, test_df, feature_cols)


if __name__ == "__main__":
    main()
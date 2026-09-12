"""
ml/src/features.py
Feature engineering for the MPLAD-SIH anomaly detection models.

LEAKAGE FIX (this version): the previous version computed desc_similarity_max,
desc_template_freq, and vendor_project_count over the WHOLE dataset (train+test
combined) before the train/test split. This let information about test-set
duplicate pairs leak into train-set features (and vice versa), inflating
duplicate_work performance in a way that would not hold on genuinely new,
unseen projects.

Fix: features are now fit on the TRAIN split only, then applied ("transformed")
onto the TEST split, the same way a StandardScaler is fit on train and applied
to test. This means:
  - vendor_project_count for test rows = that vendor's count IN TRAIN ONLY
    (unseen vendors in test get 0).
  - desc_similarity_max for test rows = similarity to the closest TRAIN
    project only (not to other test rows).
  - desc_template_freq for test rows = how often that template appeared
    IN TRAIN ONLY (unseen templates get 0).

Usage (see train.py):
    train_df, test_df = train_test_split(df, ...)   # split FIRST, on raw df
    train_df, test_df, feature_cols = build_features_split(train_df, test_df)
"""

import re
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

NUMERIC_COLS = [
    "sanctioned_amount_inr", "expenditure_amount_inr", "payment_count",
    "delay_days", "cost_deviation_pct", "progress_gap_pct",
    "fund_utilization_pct", "unspent_ratio",
    "peer_cost_zscore", "peer_progress_zscore",
    "completion_efficiency_score", "mp_completion_efficiency_avg",
    "state_completion_efficiency_avg", "payment_velocity_per_30d",
    "early_payment_share", "sanction_to_release_days",
    "recommendation_to_sanction_days", "mp_allocated_amount_inr",
    "latitude", "longitude",
]
CATEGORICAL_COLS = ["project_type", "state", "house"]
ENGINEERED_COLS = ["vendor_project_count", "desc_similarity_max", "desc_template_freq"]


def _normalize_template(text):
    text = re.sub(r"\d+", "#", str(text))
    return text


def _add_vendor_feature_split(train_df, test_df):
    vendor_counts = train_df.groupby("vendor_id")["project_id"].count()
    train_df["vendor_project_count"] = train_df["vendor_id"].map(vendor_counts).fillna(0)
    test_df["vendor_project_count"] = test_df["vendor_id"].map(vendor_counts).fillna(0)
    return train_df, test_df


def _add_description_features_split(train_df, test_df):
    train_df = train_df.copy()
    test_df = test_df.copy()
    train_df["desc_similarity_max"] = 0.0
    test_df["desc_similarity_max"] = 0.0
    train_df["desc_template"] = train_df["description"].map(_normalize_template)
    test_df["desc_template"] = test_df["description"].map(_normalize_template)

    # Group keys present in TRAIN (features are learned per project_type/state group)
    train_groups = train_df.groupby(["project_type", "state"]).groups

    for (ptype, state), train_idx in train_groups.items():
        train_idx = list(train_idx)
        train_desc = train_df.loc[train_idx, "description"].astype(str)

        vectorizer = TfidfVectorizer(stop_words="english")
        if len(train_idx) < 2:
            continue
        train_vecs = vectorizer.fit_transform(train_desc)

        # --- similarity WITHIN train (leave-one-out via k=2 neighbours, as before) ---
        nn_train = NearestNeighbors(n_neighbors=2, metric="cosine", algorithm="brute")
        nn_train.fit(train_vecs)
        dist, _ = nn_train.kneighbors(train_vecs)
        train_df.loc[train_idx, "desc_similarity_max"] = 1 - dist[:, 1]

        # --- similarity of TEST rows in this same group, against TRAIN corpus only ---
        test_mask = (test_df["project_type"] == ptype) & (test_df["state"] == state)
        test_idx = test_df.index[test_mask]
        if len(test_idx) == 0:
            continue
        test_desc = test_df.loc[test_idx, "description"].astype(str)
        test_vecs = vectorizer.transform(test_desc)  # SAME fitted vectorizer, no refitting

        nn_test = NearestNeighbors(n_neighbors=1, metric="cosine", algorithm="brute")
        nn_test.fit(train_vecs)  # test rows only ever compared against train
        dist_test, _ = nn_test.kneighbors(test_vecs)
        test_df.loc[test_idx, "desc_similarity_max"] = 1 - dist_test[:, 0]

    # --- template frequency: counted in TRAIN only, applied to both ---
    freq = train_df.groupby(["project_type", "state", "desc_template"]).size()
    train_df["desc_template_freq"] = train_df.set_index(
        ["project_type", "state", "desc_template"]
    ).index.map(freq).fillna(0).values
    test_df["desc_template_freq"] = test_df.set_index(
        ["project_type", "state", "desc_template"]
    ).index.map(freq).fillna(0).values

    train_df = train_df.drop(columns=["desc_template"])
    test_df = test_df.drop(columns=["desc_template"])
    return train_df, test_df


def _encode_categoricals_split(train_df, test_df):
    for col in CATEGORICAL_COLS:
        le = LabelEncoder()
        le.fit(train_df[col].astype(str))
        # unseen categories in test -> map to a new "unknown" code (len of classes)
        classes = list(le.classes_)
        unknown_code = len(classes)

        def encode(series, le=le, classes=classes, unknown_code=unknown_code):
            return series.astype(str).map(
                lambda v: le.transform([v])[0] if v in classes else unknown_code
            )

        train_df[col + "_enc"] = encode(train_df[col])
        test_df[col + "_enc"] = encode(test_df[col])
    return train_df, test_df


def build_features_split(train_df: pd.DataFrame, test_df: pd.DataFrame):
    """
    Leakage-safe version: fit everything on train_df, apply to test_df.
    Call this AFTER train_test_split on the raw dataframe, not before.
    Returns (train_df_with_features, test_df_with_features, feature_col_list).
    """
    train_df = train_df.copy()
    test_df = test_df.copy()

    train_df, test_df = _add_vendor_feature_split(train_df, test_df)
    train_df, test_df = _add_description_features_split(train_df, test_df)
    train_df, test_df = _encode_categoricals_split(train_df, test_df)

    feature_cols = NUMERIC_COLS + ENGINEERED_COLS + [c + "_enc" for c in CATEGORICAL_COLS]
    return train_df, test_df, feature_cols


# Kept for backward compatibility / exploratory use ONLY.
# DO NOT use this for train/test evaluation — it re-introduces the leakage
# described above. Use build_features_split() for anything that reports metrics.
def build_features(df: pd.DataFrame):
    df = df.copy()
    df, _ = _add_vendor_feature_split(df, df.iloc[0:0])  # no-op test half
    train_df, _ = _add_description_features_split(df, df.iloc[0:0])
    train_df, _ = _encode_categoricals_split(train_df, train_df.iloc[0:0])
    feature_cols = NUMERIC_COLS + ENGINEERED_COLS + [c + "_enc" for c in CATEGORICAL_COLS]
    return train_df, feature_cols
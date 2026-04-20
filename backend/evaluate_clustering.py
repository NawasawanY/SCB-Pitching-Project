"""
Clustering Evaluation Script
=============================
Runs both intrinsic metrics (Silhouette, Davies-Bouldin, noise ratio) and
exports an extrinsic human-judgment CSV so you can manually verify cluster quality.

Usage:
    cd backend
    python evaluate_clustering.py

Outputs:
    - Console report: intrinsic metric scores + pass/fail verdict
    - cluster_evaluation.csv: per-cluster article samples for human review
    - cluster_metrics_summary.csv: per-cluster silhouette scores and stats
"""

import os
import csv
import json
import numpy as np
from datetime import datetime
from collections import defaultdict

# Load .env so OPENAI_API_KEY is available without manual export
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed; rely on env var being set manually

from openai import OpenAI
from sklearn.cluster import DBSCAN
from sklearn.metrics import silhouette_score, silhouette_samples, davies_bouldin_score
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA

from news_query import NewsStore
from trend_engine import embed_texts, cluster_articles, name_trend


# ── Thresholds ────────────────────────────────────────────────────────────────
SILHOUETTE_GOOD   = 0.30   # above this = good separation
SILHOUETTE_OK     = 0.15   # above this = acceptable
DAVIES_BOULDIN_OK = 1.50   # below this = acceptable (lower is better)
NOISE_MAX_PCT     = 30.0   # below this = acceptable noise ratio
SAMPLES_PER_CLUSTER = 5    # articles to export per cluster for human review


# ── Helpers ───────────────────────────────────────────────────────────────────

def verdict(condition: bool, label_pass: str = "PASS", label_fail: str = "FAIL") -> str:
    return f"[{label_pass}]" if condition else f"[{label_fail}]"


def rating(sil: float) -> str:
    if sil >= SILHOUETTE_GOOD:
        return "GOOD"
    if sil >= SILHOUETTE_OK:
        return "OK"
    return "POOR"


# ── Intrinsic Evaluation ──────────────────────────────────────────────────────

def evaluate_intrinsic(embeddings: np.ndarray, labels: np.ndarray) -> dict:
    """Compute Silhouette, Davies-Bouldin, noise %, and per-cluster cohesion."""
    n_total     = len(labels)
    noise_mask  = labels == -1
    valid_mask  = ~noise_mask
    n_noise     = int(noise_mask.sum())
    noise_pct   = (n_noise / n_total) * 100

    unique_valid = set(labels[valid_mask])
    n_clusters   = len(unique_valid)

    results = {
        "total_articles": n_total,
        "n_clusters": n_clusters,
        "n_noise": n_noise,
        "noise_pct": round(noise_pct, 1),
        "silhouette": None,
        "davies_bouldin": None,
        "per_cluster_silhouette": {},
    }

    if n_clusters < 2 or valid_mask.sum() < 2:
        print("  [WARN] Not enough clusters to compute metrics (need >= 2 non-noise clusters).")
        return results

    emb_valid = embeddings[valid_mask]
    lab_valid = labels[valid_mask]

    sil_global = silhouette_score(emb_valid, lab_valid, metric="cosine")
    db_score   = davies_bouldin_score(emb_valid, lab_valid)
    sil_samples = silhouette_samples(emb_valid, lab_valid, metric="cosine")

    per_cluster = {}
    for cid in sorted(unique_valid):
        mask = lab_valid == cid
        per_cluster[int(cid)] = round(float(sil_samples[mask].mean()), 4)

    results["silhouette"]              = round(float(sil_global), 4)
    results["davies_bouldin"]          = round(float(db_score), 4)
    results["per_cluster_silhouette"]  = per_cluster

    return results


def print_intrinsic_report(metrics: dict):
    sil = metrics["silhouette"]
    db  = metrics["davies_bouldin"]
    nz  = metrics["noise_pct"]

    print("\n" + "=" * 60)
    print("  INTRINSIC CLUSTERING EVALUATION REPORT")
    print("=" * 60)
    print(f"  Total articles  : {metrics['total_articles']}")
    print(f"  Valid clusters  : {metrics['n_clusters']}")
    print(f"  Noise articles  : {metrics['n_noise']}  ({nz:.1f}%)")
    print()

    if sil is None:
        print("  [SKIP] Cannot compute metrics — need >= 2 clusters.")
        return

    sil_v  = verdict(sil  >= SILHOUETTE_OK)
    db_v   = verdict(db   <= DAVIES_BOULDIN_OK)
    nz_v   = verdict(nz   <= NOISE_MAX_PCT)

    print(f"  Silhouette Score    : {sil:>7.4f}  → {rating(sil):<4}  {sil_v}")
    print(f"    (good ≥ {SILHOUETTE_GOOD}, ok ≥ {SILHOUETTE_OK})")
    print()
    print(f"  Davies-Bouldin Index: {db:>7.4f}  {db_v}")
    print(f"    (lower is better, ok ≤ {DAVIES_BOULDIN_OK})")
    print()
    print(f"  Noise Ratio         : {nz:>6.1f}%  {nz_v}")
    print(f"    (ok ≤ {NOISE_MAX_PCT}%)")
    print()
    print("  Per-cluster Silhouette:")
    for cid, score in sorted(metrics["per_cluster_silhouette"].items()):
        bar = "█" * max(0, int((score + 1) * 10))
        print(f"    Cluster {cid:>3}: {score:>7.4f}  {rating(score):<4}  {bar}")

    overall = (
        (sil  >= SILHOUETTE_OK) and
        (db   <= DAVIES_BOULDIN_OK) and
        (nz   <= NOISE_MAX_PCT)
    )
    print()
    print(f"  OVERALL VERDICT : {'✓ CLUSTERING IS ACCEPTABLE' if overall else '✗ CLUSTERING NEEDS TUNING'}")
    print("=" * 60)


# ── Extrinsic CSV Export ──────────────────────────────────────────────────────

def export_human_judgment_csv(
    articles:   list,
    labels:     np.ndarray,
    metrics:    dict,
    out_path:   str = "cluster_evaluation.csv",
    samples:    int = SAMPLES_PER_CLUSTER,
):
    """
    Export a CSV with sampled articles per cluster for human review.
    Columns:
      cluster_id | cluster_name | cluster_size | per_cluster_silhouette
      | sample_rank | headline | summary | source | published
      | judge_coherent (blank) | judge_notes (blank)
    """
    cluster_indices: dict = defaultdict(list)
    for i, lbl in enumerate(labels):
        cluster_indices[int(lbl)].append(i)

    # Name each cluster via LLM (skip noise)
    cluster_names = {}
    print("\n  Naming clusters via LLM for CSV export...")
    for cid, indices in cluster_indices.items():
        if cid == -1:
            cluster_names[-1] = "NOISE / Unclustered"
            continue
        headlines = [articles[i].get("headline", "") for i in indices[:10]]
        try:
            meta = name_trend(headlines)
            cluster_names[cid] = meta.get("trend_name_en", f"Cluster {cid}")
        except Exception:
            cluster_names[cid] = f"Cluster {cid}"

    rows = []
    for cid in sorted(cluster_indices.keys()):
        indices    = cluster_indices[cid]
        cname      = cluster_names.get(cid, f"Cluster {cid}")
        csize      = len(indices)
        csil       = metrics["per_cluster_silhouette"].get(cid, "N/A")

        # Sample up to `samples` articles; for noise take first few
        sampled = indices[:samples]

        for rank, idx in enumerate(sampled, start=1):
            art = articles[idx]
            rows.append({
                "cluster_id":               cid,
                "cluster_name":             cname,
                "cluster_size":             csize,
                "per_cluster_silhouette":   csil,
                "sample_rank":              rank,
                "headline":                 art.get("headline", ""),
                "summary":                  (art.get("summary", "") or "")[:300],
                "source":                   art.get("source", ""),
                "published":                art.get("published", ""),
                "judge_coherent":           "",   # fill in: YES / NO / PARTIAL
                "judge_notes":              "",   # fill in: free text
            })

    fieldnames = [
        "cluster_id", "cluster_name", "cluster_size", "per_cluster_silhouette",
        "sample_rank", "headline", "summary", "source", "published",
        "judge_coherent", "judge_notes",
    ]

    with open(out_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n  Human-judgment CSV saved → {out_path}")
    print(f"  {len(rows)} rows across {len(cluster_indices)} clusters (incl. noise).")
    print()
    print("  HOW TO JUDGE:")
    print("    Open cluster_evaluation.csv in Excel / Google Sheets.")
    print("    For each group of rows (same cluster_id), read the headlines.")
    print("    Fill in 'judge_coherent':")
    print("      YES     → all headlines clearly share the same topic")
    print("      PARTIAL → mostly related but 1-2 outliers")
    print("      NO      → mixed / unrelated headlines in the same cluster")
    print("    Add any notes in 'judge_notes' (e.g. 'mixed Thai & global macro').")


# ── Per-cluster metrics summary CSV ──────────────────────────────────────────

def export_metrics_summary_csv(
    metrics:  dict,
    out_path: str = "cluster_metrics_summary.csv",
):
    rows = []
    for cid, sil in sorted(metrics["per_cluster_silhouette"].items()):
        rows.append({
            "cluster_id":    cid,
            "silhouette":    sil,
            "rating":        rating(sil),
            "global_silhouette":   metrics["silhouette"],
            "davies_bouldin":      metrics["davies_bouldin"],
            "noise_pct":           metrics["noise_pct"],
        })

    with open(out_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    print(f"  Metrics summary CSV saved → {out_path}")


# ── EPS Sweep (optional) ──────────────────────────────────────────────────────

def sweep_eps(embeddings: np.ndarray, eps_values=None):
    """Try multiple eps values and report silhouette for each. Helps find optimal eps."""
    if eps_values is None:
        eps_values = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50]

    print("\n  EPS SWEEP (finding best eps for DBSCAN):")
    print(f"  {'eps':>6}  {'clusters':>8}  {'noise%':>7}  {'silhouette':>11}  {'rating'}")
    print("  " + "-" * 52)

    best_sil, best_eps = -1, None
    for eps in eps_values:
        labels = cluster_articles(embeddings, eps=eps)
        valid  = labels != -1
        n_cl   = len(set(labels[valid]))
        n_nz   = (~valid).mean() * 100

        if n_cl >= 2 and valid.sum() >= 2:
            sil = silhouette_score(embeddings[valid], labels[valid], metric="cosine")
            r   = rating(sil)
            marker = " ◄ best" if sil > best_sil else ""
            print(f"  {eps:>6.2f}  {n_cl:>8}  {n_nz:>6.1f}%  {sil:>11.4f}  {r}{marker}")
            if sil > best_sil:
                best_sil, best_eps = sil, eps
        else:
            print(f"  {eps:>6.2f}  {n_cl:>8}  {n_nz:>6.1f}%  {'N/A':>11}")

    if best_eps:
        print(f"\n  Recommended eps = {best_eps}  (silhouette = {best_sil:.4f})")
    print()


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\nLoading articles from news_database.json...")
    articles = NewsStore.load()
    articles = [a for a in articles if a.get("headline", "").strip()]

    if len(articles) < 3:
        print("Not enough articles (need >= 3). Run news fetch first.")
        return

    print(f"Loaded {len(articles)} articles.")
    print("Generating embeddings (this may take a moment)...")

    texts = [
        f"{a.get('headline', '')} {a.get('summary', '')}".strip()
        for a in articles
    ]
    embeddings = embed_texts(texts)

    print("Running DBSCAN clustering (eps=0.30, min_samples=2)...")
    labels = cluster_articles(embeddings)

    # 1. Intrinsic metrics
    metrics = evaluate_intrinsic(embeddings, labels)
    print_intrinsic_report(metrics)

    # 2. EPS sweep — see if 0.30 is really the best setting
    sweep_eps(embeddings)

    # 3. Human judgment CSV
    export_human_judgment_csv(articles, labels, metrics)

    # 4. Per-cluster metrics summary CSV
    if metrics["silhouette"] is not None:
        export_metrics_summary_csv(metrics)

    print("\nDone. Check the two CSV files in the backend/ folder.")


if __name__ == "__main__":
    main()

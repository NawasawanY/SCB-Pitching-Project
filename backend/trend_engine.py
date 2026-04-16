"""
Trend Radar — Semantic clustering of news articles using embeddings + DBSCAN.
Detects emerging trends by tracking cluster growth over sliding time windows.
"""

import os
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

from openai import OpenAI
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_similarity

from news_query import NewsStore


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ── Embedding ────────────────────────────────────────────────────────────────

def embed_texts(texts: List[str]) -> np.ndarray:
    """Batch-embed texts via text-embedding-3-small (~$0.00002 / call)."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )
    return np.array([d.embedding for d in response.data])


# ── Clustering ───────────────────────────────────────────────────────────────

def cluster_articles(
    embeddings: np.ndarray,
    eps: float = 0.25,
    min_samples: int = 2,
) -> np.ndarray:
    """DBSCAN on cosine-distance.  Returns cluster labels (-1 = noise)."""
    distance_matrix = 1 - cosine_similarity(embeddings)
    db = DBSCAN(eps=eps, min_samples=min_samples, metric="precomputed")
    return db.fit_predict(distance_matrix)


# ── Growth detection ─────────────────────────────────────────────────────────

def _parse_date(date_str: str) -> Optional[datetime]:
    """Best-effort date parsing for RSS-style date strings."""
    for fmt in (
        "%a, %d %b %Y %H:%M:%S %z",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S",
    ):
        try:
            return datetime.strptime(date_str, fmt)
        except (ValueError, TypeError):
            continue
    return None


def detect_growing_clusters(
    articles: List[Dict],
    labels: np.ndarray,
    window_hours: int = 48,
) -> List[Dict]:
    """
    For each cluster, count articles in the recent window vs. older ones.
    A cluster whose recent share > 60 % is flagged as *emerging*.
    """
    now = datetime.now().astimezone() if articles else datetime.now()
    cutoff = now - timedelta(hours=window_hours)
    clusters: Dict[int, Dict] = defaultdict(lambda: {"recent": 0, "old": 0, "indices": []})

    for idx, label in enumerate(labels):
        if label == -1:
            continue
        pub = _parse_date(articles[idx].get("published", ""))
        bucket = "recent" if (pub and pub > cutoff) else "old"
        clusters[label][bucket] += 1
        clusters[label]["indices"].append(idx)

    growing = []
    for cid, info in clusters.items():
        total = info["recent"] + info["old"]
        ratio = info["recent"] / total if total else 0
        growing.append({
            "cluster_id": int(cid),
            "size": total,
            "recent_count": info["recent"],
            "growth_ratio": round(ratio, 2),
            "emerging": ratio > 0.6,
            "article_indices": info["indices"],
        })

    return sorted(growing, key=lambda c: c["growth_ratio"], reverse=True)


# ── LLM Trend Naming ────────────────────────────────────────────────────────

def name_trend(headlines: List[str]) -> Dict:
    """Ask GPT-4o-mini to name a trend and match it to an SCB product."""
    joined = "\n".join(f"- {h}" for h in headlines[:10])
    prompt = (
        "You are a financial trend analyst at SCB (Siam Commercial Bank), Thailand.\n"
        "Given these clustered news headlines, respond in JSON with keys:\n"
        '  "trend_name": short Thai name for the trend,\n'
        '  "trend_name_en": short English name,\n'
        '  "summary": 1-2 sentence Thai explanation,\n'
        '  "confidence": float 0-1,\n'
        '  "scb_products": list of relevant SCB product names,\n'
        '  "category": one of ["rate", "equity", "gold", "fx", "property", "crypto", "macro", "other"]\n\n'
        f"Headlines:\n{joined}"
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )
    import json
    return json.loads(response.choices[0].message.content)


# ── Public API ───────────────────────────────────────────────────────────────

def detect_trends(window_days: int = 7) -> Dict:
    """
    End-to-end pipeline:
      load articles → embed → cluster → detect growth → name trends.
    Returns a dict ready for the API response.
    """
    articles = NewsStore.load()
    if len(articles) < 3:
        return {"trends": [], "article_count": len(articles)}

    texts = [
        f"{a.get('headline', '')} {a.get('summary', '')}"
        for a in articles
    ]
    embeddings = embed_texts(texts)
    labels = cluster_articles(embeddings)
    cluster_info = detect_growing_clusters(articles, labels, window_hours=window_days * 24)

    trends = []
    for cluster in cluster_info:
        if cluster["size"] < 2:
            continue
        headlines = [articles[i]["headline"] for i in cluster["article_indices"]]
        trend_meta = name_trend(headlines)
        trends.append({
            **trend_meta,
            "cluster_size": cluster["size"],
            "growth_ratio": cluster["growth_ratio"],
            "emerging": cluster["emerging"],
            "headlines": headlines[:5],
        })

    return {
        "trends": trends,
        "article_count": len(articles),
        "cluster_count": len([c for c in cluster_info if c["size"] >= 2]),
    }

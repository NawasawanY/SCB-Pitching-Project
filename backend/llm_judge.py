"""
LLM-as-a-Judge for Cluster Coherence
======================================
Reads cluster_evaluation.csv, sends each cluster's headlines to GPT-4o-mini,
and fills in judge_coherent + judge_notes automatically.

Usage:
    cd backend
    python llm_judge.py

Output:
    cluster_evaluation_judged.csv  — same format + filled judge columns
    cluster_judge_summary.csv      — one row per cluster: verdict + reason
"""

import os
import csv
import json
from collections import defaultdict

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

INPUT_CSV   = "cluster_evaluation.csv"
OUTPUT_CSV  = "cluster_evaluation_judged.csv"
SUMMARY_CSV = "cluster_judge_summary.csv"


# ── LLM Judge ─────────────────────────────────────────────────────────────────

def judge_cluster(cluster_name: str, headlines: list[str]) -> dict:
    """
    Ask GPT-4o-mini to judge whether the headlines in a cluster are coherent.
    Returns: { verdict: YES|PARTIAL|NO, confidence: 0-1, reason: str, topic: str }
    """
    joined = "\n".join(f"- {h}" for h in headlines if h.strip())
    prompt = (
        "You are evaluating whether a group of news headlines has been correctly clustered together.\n"
        "The cluster is named: \"{name}\"\n\n"
        "Headlines in this cluster:\n{headlines}\n\n"
        "Respond in JSON with these keys:\n"
        "  \"verdict\": one of [\"YES\", \"PARTIAL\", \"NO\"]\n"
        "    YES     = all headlines clearly share the same specific topic\n"
        "    PARTIAL = mostly related but 1-2 headlines feel out of place\n"
        "    NO      = headlines cover clearly different topics\n"
        "  \"confidence\": float 0.0 to 1.0 — how confident you are in the verdict\n"
        "  \"topic\": one sentence describing what the cluster is actually about\n"
        "  \"reason\": one sentence explaining your verdict (mention any outliers if PARTIAL/NO)\n"
    ).format(name=cluster_name, headlines=joined)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(response.choices[0].message.content)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    # Load CSV
    with open(INPUT_CSV, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    # Group by cluster_id
    clusters: dict = defaultdict(lambda: {"name": "", "size": 0, "silhouette": "N/A", "rows": []})
    for row in rows:
        cid = row["cluster_id"]
        clusters[cid]["name"]       = row["cluster_name"]
        clusters[cid]["size"]       = row["cluster_size"]
        clusters[cid]["silhouette"] = row["per_cluster_silhouette"]
        clusters[cid]["rows"].append(row)

    print(f"Loaded {len(rows)} rows across {len(clusters)} clusters.\n")

    # Judge each cluster (skip noise)
    judgments: dict = {}
    summary_rows = []

    for cid, info in sorted(clusters.items(), key=lambda x: int(x[0])):
        if cid == "-1":
            judgments[cid] = {"verdict": "N/A", "confidence": None, "topic": "Noise / unclustered articles", "reason": "Skipped — noise cluster"}
            summary_rows.append({
                "cluster_id":    cid,
                "cluster_name":  info["name"],
                "cluster_size":  info["size"],
                "silhouette":    info["silhouette"],
                "verdict":       "N/A",
                "confidence":    "",
                "topic":         "Noise / unclustered",
                "reason":        "Skipped",
            })
            print(f"  Cluster {cid:>3} ({info['name']}) → SKIPPED (noise)")
            continue

        headlines = [r["headline"] for r in info["rows"] if r["headline"].strip()]
        print(f"  Judging cluster {cid:>3}: {info['name']} ({len(headlines)} headlines)...", end=" ", flush=True)

        try:
            result = judge_cluster(info["name"], headlines)
            verdict    = result.get("verdict", "NO")
            confidence = result.get("confidence", 0)
            topic      = result.get("topic", "")
            reason     = result.get("reason", "")
        except Exception as e:
            verdict, confidence, topic, reason = "ERROR", 0, "", str(e)

        judgments[cid] = {"verdict": verdict, "confidence": confidence, "topic": topic, "reason": reason}

        icon = {"YES": "✓", "PARTIAL": "~", "NO": "✗", "ERROR": "!"}.get(verdict, "?")
        print(f"{icon} {verdict}  (confidence: {confidence:.2f})")

        summary_rows.append({
            "cluster_id":    cid,
            "cluster_name":  info["name"],
            "cluster_size":  info["size"],
            "silhouette":    info["silhouette"],
            "verdict":       verdict,
            "confidence":    round(float(confidence), 2),
            "topic":         topic,
            "reason":        reason,
        })

    # Write judged CSV (original + filled judge columns)
    for row in rows:
        cid = row["cluster_id"]
        j   = judgments.get(cid, {})
        row["judge_coherent"] = j.get("verdict", "")
        row["judge_notes"]    = j.get("reason", "")

    fieldnames = list(rows[0].keys())
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n  Judged CSV saved → {OUTPUT_CSV}")

    # Write summary CSV
    summary_fields = ["cluster_id", "cluster_name", "cluster_size", "silhouette",
                      "verdict", "confidence", "topic", "reason"]
    with open(SUMMARY_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=summary_fields)
        writer.writeheader()
        writer.writerows(summary_rows)

    print(f"  Summary CSV saved  → {SUMMARY_CSV}")

    # Print final tally
    verdicts = [j["verdict"] for j in judgments.values() if j["verdict"] not in ("N/A", "ERROR")]
    yes     = verdicts.count("YES")
    partial = verdicts.count("PARTIAL")
    no      = verdicts.count("NO")
    total   = len(verdicts)

    print(f"""
{'='*55}
  LLM JUDGE SUMMARY
{'='*55}
  Clusters judged : {total}
  YES  (coherent) : {yes:>3}  ({yes/total*100:.0f}%)
  PARTIAL         : {partial:>3}  ({partial/total*100:.0f}%)
  NO (incoherent) : {no:>3}  ({no/total*100:.0f}%)
{'='*55}
""")


if __name__ == "__main__":
    main()

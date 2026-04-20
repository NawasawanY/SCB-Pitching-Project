"""
Campaign Engine — Takes a detected trend and generates:
  1. Campaign brief with SCB product match
  2. Segment ranking with predicted conversion
  3. Ready-to-send LINE message draft
"""

import os
import json
from typing import Dict, List, Optional

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ── SCB Customer Segments ────────────────────────────────────────────────────

SEGMENTS = [
    {
        "name": "SCB PRIVATE BANKING",
        "age_range": "45-65",
        "aum": ">50M THB",
        "size": "12K",
        "products": ["structured notes", "private equity", "estate planning", "offshore funds"],
        "risk_appetite": "moderate-high",
    },
    {
        "name": "SCB FIRST",
        "age_range": "35-55",
        "aum": "10-50M THB",
        "size": "320K",
        "products": ["mutual funds", "bonds", "gold", "insurance", "FX"],
        "risk_appetite": "moderate",
    },
    {
        "name": "SCB PRIME",
        "age_range": "30-50",
        "aum": "2-10M THB",
        "size": "890K",
        "products": ["SSF/RMF", "mutual funds", "credit cards", "personal loans"],
        "risk_appetite": "moderate",
    },
    {
        "name": "WEALTH POTENTIAL",
        "age_range": "25-40",
        "aum": "0.5-2M THB",
        "size": "1.5M",
        "products": ["savings", "SSF", "robo-advisor", "easy invest"],
        "risk_appetite": "low-moderate",
    },
    {
        "name": "UPPER MASS",
        "age_range": "22-35",
        "aum": "<0.5M THB",
        "size": "2.4M",
        "products": ["deposits", "digital banking", "nano-loans", "insurance starter"],
        "risk_appetite": "low",
    },
]


# ── Campaign Generation ─────────────────────────────────────────────────────

def generate_campaign_from_trend(trend: Dict) -> Dict:
    """
    Given a trend dict (from trend_engine.detect_trends), produce:
      - campaign brief
      - ranked segments
      - LINE message draft
    """
    trend_name = trend.get("trend_name", trend.get("trend_name_en", "Unknown"))
    summary = trend.get("summary", "")
    headlines = trend.get("headlines", [])
    scb_products = trend.get("scb_products", [])
    category = trend.get("category", "other")
    confidence = trend.get("confidence", 0.5)

    segments_str = json.dumps(SEGMENTS, ensure_ascii=False, indent=2)
    headlines_str = "\n".join(f"- {h}" for h in headlines[:5])

    prompt = (
        "You are the Campaign Strategist at SCB (Siam Commercial Bank), Thailand.\n\n"
        f"## Detected Trend\n"
        f"Name: {trend_name}\n"
        f"Summary: {summary}\n"
        f"Category: {category}\n"
        f"Confidence: {confidence}\n"
        f"Related Headlines:\n{headlines_str}\n"
        f"Suggested Products: {', '.join(scb_products)}\n\n"
        f"## Available Segments\n{segments_str}\n\n"
        "## Task\n"
        "Generate a campaign response in JSON with these keys:\n"
        '  "campaign_name": short Thai campaign name,\n'
        '  "campaign_name_en": English version,\n'
        '  "objective": 1-sentence campaign objective in Thai,\n'
        '  "target_segments": [\n'
        '    {\n'
        '      "segment_name": str,\n'
        '      "match_score": int 0-100,\n'
        '      "predicted_ctr": float (e.g. 0.034),\n'
        '      "predicted_cvs": float (e.g. 0.243),\n'
        '      "reasoning": short Thai explanation\n'
        '    }\n'
        '  ] (ranked best-first, include all 5 segments),\n'
        '  "line_message": {\n'
        '    "title": short Thai push title (max 40 chars),\n'
        '    "body": Thai message body (max 120 chars),\n'
        '    "cta_text": CTA button text,\n'
        '    "cta_url": "https://scb.co.th/campaign/..."\n'
        '  },\n'
        '  "recommended_products": list of specific SCB product names,\n'
        '  "urgency": "immediate" | "within_week" | "evergreen",\n'
        '  "estimated_reach": int (total addressable from top 2 segments)\n'
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )

    campaign = json.loads(response.choices[0].message.content)

    # Attach the source trend metadata
    campaign["source_trend"] = {
        "name": trend_name,
        "confidence": confidence,
        "category": category,
        "cluster_size": trend.get("cluster_size", 0),
        "emerging": trend.get("emerging", False),
    }

    return campaign


# ── Batch: trends → campaigns ────────────────────────────────────────────────

def generate_all_campaigns(trends: List[Dict], top_n: int = 3) -> List[Dict]:
    """Generate campaigns for the top-N trends."""
    campaigns = []
    for trend in trends[:top_n]:
        campaign = generate_campaign_from_trend(trend)
        campaigns.append(campaign)
    return campaigns

"""
Signal Map — Entity co-occurrence graph built from news articles.
Extracts financial entities, builds weighted edges, and returns
graph data suitable for D3.js force-directed visualization.
"""

import os
import re
import json
from collections import defaultdict
from typing import List, Dict, Set, Tuple

from openai import OpenAI
from news_query import NewsStore

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ── Known Thai financial entities (fast path — no LLM needed) ────────────────

KNOWN_ENTITIES: Dict[str, str] = {
    # Organizations
    "ธปท": "ORG", "BOT": "ORG", "แบงก์ชาติ": "ORG",
    "กลต": "ORG", "SEC": "ORG",
    "SCB": "ORG", "ไทยพาณิชย์": "ORG", "SCBX": "ORG",
    "กสิกร": "ORG", "KBANK": "ORG",
    "กรุงเทพ": "ORG", "BBL": "ORG",
    "กรุงไทย": "ORG", "KTB": "ORG",
    "ทีทีบี": "ORG", "TTB": "ORG",
    "Fed": "ORG", "เฟด": "ORG",
    "ก.ล.ต.": "ORG", "คลัง": "ORG",
    "SET": "ORG", "ตลาดหลักทรัพย์": "ORG",
    "กบข": "ORG", "สศช": "ORG",
    # Products / Concepts
    "ทองคำ": "PRODUCT", "gold": "PRODUCT",
    "กองทุน": "PRODUCT", "mutual fund": "PRODUCT",
    "พันธบัตร": "PRODUCT", "bond": "PRODUCT",
    "หุ้นกู้": "PRODUCT", "debenture": "PRODUCT",
    "ประกัน": "PRODUCT", "insurance": "PRODUCT",
    "สินเชื่อ": "PRODUCT", "loan": "PRODUCT",
    "บัตรเครดิต": "PRODUCT", "credit card": "PRODUCT",
    "เงินฝาก": "PRODUCT", "deposit": "PRODUCT",
    "LTF": "PRODUCT", "RMF": "PRODUCT", "SSF": "PRODUCT", "ThaiESG": "PRODUCT",
    "ETF": "PRODUCT", "DW": "PRODUCT",
    "คริปโต": "PRODUCT", "crypto": "PRODUCT", "Bitcoin": "PRODUCT",
    # Events / Macro
    "ดอกเบี้ย": "EVENT", "rate cut": "EVENT", "ลดดอกเบี้ย": "EVENT", "ขึ้นดอกเบี้ย": "EVENT",
    "เงินเฟ้อ": "EVENT", "inflation": "EVENT",
    "GDP": "EVENT",
    "QE": "EVENT", "มาตรการกระตุ้น": "EVENT",
    "trade war": "EVENT", "สงครามการค้า": "EVENT",
    "tariff": "EVENT", "ภาษี": "EVENT", "tariffs": "EVENT",
    "เศรษฐกิจ": "EVENT",
    # Geopolitical
    "สหรัฐ": "GPE", "US": "GPE", "จีน": "GPE", "China": "GPE",
    "ญี่ปุ่น": "GPE", "Japan": "GPE",
    "ไทย": "GPE", "Thailand": "GPE",
    "EU": "GPE", "ยุโรป": "GPE",
}

# Compile a single regex for fast matching
_ENTITY_PATTERN = re.compile(
    "|".join(re.escape(k) for k in sorted(KNOWN_ENTITIES, key=len, reverse=True)),
    re.IGNORECASE,
)


# ── Entity extraction ────────────────────────────────────────────────────────

def extract_entities_fast(text: str) -> List[Tuple[str, str]]:
    """Regex-based extraction against the known-entity dictionary.  Fast & free."""
    found: List[Tuple[str, str]] = []
    seen: Set[str] = set()
    for match in _ENTITY_PATTERN.finditer(text):
        name = match.group()
        # Normalise to canonical form (first key that matches case-insensitively)
        canonical = name
        for key in KNOWN_ENTITIES:
            if key.lower() == name.lower():
                canonical = key
                break
        if canonical not in seen:
            seen.add(canonical)
            found.append((canonical, KNOWN_ENTITIES.get(canonical, "OTHER")))
    return found


def extract_entities_llm(text: str) -> List[Tuple[str, str]]:
    """LLM-based extraction for richer entity coverage (costs ~$0.0001)."""
    prompt = (
        "Extract financial entities from this Thai news text. "
        "Return a JSON array of objects with keys 'name' and 'type'. "
        "Types: ORG, PRODUCT, EVENT, GPE, MONEY.\n\n"
        f"Text: {text[:1000]}"
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )
    data = json.loads(response.choices[0].message.content)
    entities = data.get("entities", data.get("result", []))
    if isinstance(entities, list):
        return [(e["name"], e.get("type", "OTHER")) for e in entities if "name" in e]
    return []


# ── Co-occurrence Graph ──────────────────────────────────────────────────────

class CooccurrenceGraph:
    def __init__(self):
        self.edges: Dict[Tuple[str, str], float] = defaultdict(float)
        self.nodes: Dict[str, Dict] = defaultdict(lambda: {"count": 0, "type": "OTHER"})

    def ingest(self, text: str, use_llm: bool = False):
        """Process one article: extract entities, add co-occurrence edges."""
        if use_llm:
            entities = extract_entities_llm(text)
        else:
            entities = extract_entities_fast(text)

        for name, etype in entities:
            self.nodes[name]["count"] += 1
            self.nodes[name]["type"] = etype

        names = [e[0] for e in entities]
        for i, a in enumerate(names):
            for b in names[i + 1:]:
                key = tuple(sorted([a, b]))
                self.edges[key] += 1.0

    def ingest_batch(self, articles: List[Dict], use_llm: bool = False):
        """Process all articles."""
        for article in articles:
            text = f"{article.get('headline', '')} {article.get('summary', '')}"
            self.ingest(text, use_llm=use_llm)

    def top_connections(self, entity: str, n: int = 5) -> List[Dict]:
        related = [
            {"source": k[0], "target": k[1], "weight": v}
            for k, v in self.edges.items()
            if entity in k
        ]
        return sorted(related, key=lambda x: x["weight"], reverse=True)[:n]

    def to_d3_json(self, min_weight: float = 1.0) -> Dict:
        """
        Export the graph as D3.js-compatible { nodes, links }.
        Filters out low-weight edges for cleaner visualization.
        """
        # Collect nodes that appear in at least one qualifying edge
        active_nodes: Set[str] = set()
        links = []
        for (src, tgt), weight in self.edges.items():
            if weight >= min_weight:
                active_nodes.add(src)
                active_nodes.add(tgt)
                links.append({
                    "source": src,
                    "target": tgt,
                    "weight": weight,
                })

        nodes = [
            {
                "id": name,
                "type": self.nodes[name]["type"],
                "count": self.nodes[name]["count"],
            }
            for name in active_nodes
        ]

        return {"nodes": nodes, "links": links}


# ── Public API ───────────────────────────────────────────────────────────────

def build_signal_map(use_llm: bool = False, min_weight: float = 1.0) -> Dict:
    """
    End-to-end: load articles → extract entities → build graph → return D3 JSON.
    """
    articles = NewsStore.load()
    graph = CooccurrenceGraph()
    graph.ingest_batch(articles, use_llm=use_llm)
    d3 = graph.to_d3_json(min_weight=min_weight)
    return {
        **d3,
        "article_count": len(articles),
        "entity_count": len(d3["nodes"]),
        "edge_count": len(d3["links"]),
    }

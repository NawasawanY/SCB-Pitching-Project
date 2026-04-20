from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

class ImpactEnum(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class SentimentEnum(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class UrgencyEnum(str, Enum):
    TIME_SENSITIVE = "time-sensitive"
    EVERGREEN = "evergreen"

class NewsArticle(BaseModel):
    id: Optional[int] = None
    headline: str
    summary: str
    source: str
    time: str = Field(default_factory=lambda: datetime.now().strftime("%H:%M น."))
    category: str
    impact: ImpactEnum
    sentiment: SentimentEnum
    urgency: UrgencyEnum
    relevanceScore: int
    affectedProducts: List[str]
    url: str = "#"

class TargetGroup(BaseModel):
    name: str
    size: str
    matchScore: int

class Campaign(BaseModel):
    title: str
    headline: str
    description: str
    cta: str

class Predictions(BaseModel):
    expectedSent: int
    expectedCTR: float
    expectedCVS: float
    expectedTransactions: int
    expectedAllotment: int

class CampaignRecommendation(BaseModel):
    id: Optional[int] = None
    rank: int
    confidence: int
    status: str
    linkedNews: Dict[str, Any]
    campaign: Campaign
    targetGroup: TargetGroup
    predictions: Predictions
    reasoning: List[str]


# ── Trend Radar models ───────────────────────────────────────────────────────

class TrendItem(BaseModel):
    trend_name: str = ""
    trend_name_en: str = ""
    summary: str = ""
    confidence: float = 0.0
    scb_products: List[str] = []
    category: str = "other"
    cluster_size: int = 0
    growth_ratio: float = 0.0
    emerging: bool = False
    headlines: List[str] = []

class TrendRadarResponse(BaseModel):
    trends: List[TrendItem]
    article_count: int
    cluster_count: int = 0


# ── Signal Map models ────────────────────────────────────────────────────────

class GraphNode(BaseModel):
    id: str
    type: str
    count: int

class GraphLink(BaseModel):
    source: str
    target: str
    weight: float

class SignalMapResponse(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]
    article_count: int
    entity_count: int
    edge_count: int


# ── Campaign Engine models ───────────────────────────────────────────────────

class LineMessage(BaseModel):
    title: str = ""
    body: str = ""
    cta_text: str = ""
    cta_url: str = ""

class SegmentMatch(BaseModel):
    segment_name: str
    match_score: int = 0
    predicted_ctr: float = 0.0
    predicted_cvs: float = 0.0
    reasoning: str = ""

class SourceTrend(BaseModel):
    name: str = ""
    confidence: float = 0.0
    category: str = "other"
    cluster_size: int = 0
    emerging: bool = False

class TrendCampaign(BaseModel):
    campaign_name: str = ""
    campaign_name_en: str = ""
    objective: str = ""
    target_segments: List[SegmentMatch] = []
    line_message: Optional[LineMessage] = None
    recommended_products: List[str] = []
    urgency: str = "evergreen"
    estimated_reach: int = 0
    source_trend: Optional[SourceTrend] = None

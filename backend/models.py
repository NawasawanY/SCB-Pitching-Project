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

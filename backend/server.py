import os
import json
from typing import Optional, Dict, Any, TypedDict, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END

# Import refactored models and fetcher
from models import (
    NewsArticle, Campaign, Predictions,
    CampaignRecommendation, TargetGroup,
    ImpactEnum, SentimentEnum, UrgencyEnum,
    TrendRadarResponse, SignalMapResponse, TrendCampaign,
)
from news_query import NewsFetcher, NewsStore
from trend_engine import detect_trends
from signal_map import build_signal_map
from campaign_engine import generate_campaign_from_trend, generate_all_campaigns

load_dotenv()

app = FastAPI(title="SCB Pitching AI Backend - Insights Engine")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LangGraph State Definition ---

class AgentState(TypedDict):
    raw_news: str
    news_article: Optional[NewsArticle]
    campaign_brief: Optional[Dict[str, Any]]
    campaign_content: Optional[Campaign]
    performance_forecast: Optional[Predictions]
    reasoning: List[str]
    iterations: int
    approved: bool
    context_news: List[Dict] # For RAG support

# --- Agent 1: News Intelligence Analyst ---

def news_analyst_agent(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the News Intelligence Analyst for SCB. Your role is to read raw financial news, score it for relevance to SCB products, and tag it properly. Return a JSON object matching the NewsArticle model."),
        ("human", "Analyze this news: {raw_news}")
    ])
    
    chain = prompt | llm.with_structured_output(NewsArticle)
    result = chain.invoke({"raw_news": state["raw_news"]})
    
    return {
        "news_article": result,
        "reasoning": state.get("reasoning", []) + ["News Intelligence Analyst: Scored and tagged the news article."]
    }

# --- Agent 2: Data Strategist (RAG Optimized) ---

def data_strategist_agent(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
    article = state["news_article"]
    
    # RAG: Search the local store for *related* news to provide "Feasible Insights"
    all_news = NewsStore.load()
    # Simplified Semantic Match: Search for related terms in the summary/headline
    related_context = []
    keywords = [article.category] + article.affectedProducts
    for news in all_news:
        if any(kw.lower() in news['headline'].lower() or kw.lower() in news['summary'].lower() for kw in keywords):
            related_context.append(news['headline'])
    
    context_str = "\n".join(related_context[:5]) if related_context else "No additional context found."
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Data Strategist at SCB. Match the news trend to SCB products and segments. You have access to additional context from other news articles to strengthen your reasoning."),
        ("human", "Core News: {headline}\nAffected Products: {products}\n\nSupporting News Context from Database:\n{context}")
    ])
    
    response = llm.invoke(prompt.format(
        headline=article.headline, 
        products=", ".join(article.affectedProducts),
        context=context_str
    ))
    
    target_groups = {
        "Prime": {"size": "890K", "matchScore": 94},
        "FIRST": {"size": "320K", "matchScore": 91},
        "Wealth Potential": {"size": "1.5M", "matchScore": 88},
        "Upper Mass": {"size": "2.4M", "matchScore": 78}
    }
    
    segment = "Prime" if article.impact == ImpactEnum.HIGH else "Upper Mass"
    
    return {
        "campaign_brief": {
            "target_segment": segment,
            "target_info": target_groups[segment],
            "strategy_note": response.content,
            "supporting_insights": related_context[:3]
        },
        "reasoning": state["reasoning"] + [f"Data Strategist: Matched trend to {segment} using RAG context from {len(related_context)} related articles."]
    }

# --- Agent 3 & 4 (remain same but use enhanced context) ---
def copywriter_agent(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
    article = state["news_article"]
    brief = state["campaign_brief"]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Copywriter at SCB. Generate a highly localized, engaging Thai ad campaign based on the brief. Return a JSON matching the Campaign model."),
        ("human", "Context: {news}\nTarget: {segment}\nStrategy Insights: {insights}")
    ])
    
    chain = prompt | llm.with_structured_output(Campaign)
    campaign = chain.invoke({
        "news": article.summary, 
        "segment": brief["target_segment"],
        "insights": brief.get("strategy_note", "")
    })
    
    return {
        "campaign_content": campaign,
        "reasoning": state["reasoning"] + ["Copywriter Agent: Generated Thai ad copy based on deep insights."]
    }

def performance_predictor_agent(state: AgentState):
    campaign = state["campaign_content"]
    ctr = 0.4 
    if state["iterations"] == 0 and "ด่วน" not in campaign.description and "urgent" not in campaign.description.lower():
         ctr = 0.25 
    
    predictions = Predictions(
        expectedSent=500000,
        expectedCTR=ctr,
        expectedCVS=0.8,
        expectedTransactions=4000,
        expectedAllotment=8000000
    )
    
    approved = ctr >= 0.3
    reason = "Performance Predictor: Forecasted CTR at {:.2f}%. {}".format(
        ctr, "Approved." if approved else "Rejected - needs more urgency."
    )
    
    return {
        "performance_forecast": predictions,
        "approved": approved,
        "iterations": state["iterations"] + 1,
        "reasoning": state["reasoning"] + [reason]
    }

def should_continue(state: AgentState):
    if state["approved"]: return END
    if state["iterations"] >= 3: return END
    return "copywriter"

# --- Graph Construction ---
workflow = StateGraph(AgentState)
workflow.add_node("news_analyst", news_analyst_agent)
workflow.add_node("data_strategist", data_strategist_agent)
workflow.add_node("copywriter", copywriter_agent)
workflow.add_node("performance_predictor", performance_predictor_agent)

workflow.set_entry_point("news_analyst")
workflow.add_edge("news_analyst", "data_strategist")
workflow.add_edge("data_strategist", "copywriter")
workflow.add_edge("copywriter", "performance_predictor")
workflow.add_conditional_edges("performance_predictor", should_continue)

graph = workflow.compile()

# --- API Endpoints ---

@app.get("/api/sync-news")
async def sync_news():
    """Fetches 50 news and updates the local store."""
    try:
        news = NewsFetcher.get_50_news()
        added = NewsStore.save(news)
        return {"status": "success", "fetched": len(news), "added": added}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trends")
async def get_trends():
    """Identifies top-level trends across all stored news (Hierarchical Summarization)."""
    all_news = NewsStore.load()
    if not all_news:
        return {"trends": []}
    
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    headlines = [n['headline'] for n in all_news[:30]] # Sample for speed
    
    prompt = "Based on these financial headlines, identify the 3 most important trends for SCB Thailand. Provide a title and a brief 1-sentence impact.\n\n" + "\n".join(headlines)
    response = llm.invoke(prompt)
    
    return {"analysis": response.content, "news_count": len(all_news)}

@app.post("/api/generate-campaign", response_model=CampaignRecommendation)
async def generate_campaign(news_input: Dict[str, str]):
    raw_text = news_input.get("text", "")
    initial_state = {
        "raw_news": raw_text,
        "news_article": None,
        "campaign_brief": None,
        "campaign_content": None,
        "performance_forecast": None,
        "reasoning": [],
        "iterations": 0,
        "approved": False,
        "context_news": []
    }
    
    result = graph.invoke(initial_state)
    news = result["news_article"]
    campaign = result["campaign_content"]
    predictions = result["performance_forecast"]
    brief = result["campaign_brief"]
    
    recommendation = CampaignRecommendation(
        id=1,
        rank=1,
        confidence=95,
        status="hot" if predictions.expectedCTR > 0.35 else "recommended",
        linkedNews={
            "headline": news.headline,
            "source": news.source,
            "category": news.category,
            "impact": news.impact
        },
        campaign=campaign,
        targetGroup=TargetGroup(
            name=brief["target_segment"],
            size=brief["target_info"]["size"],
            matchScore=brief["target_info"]["matchScore"]
        ),
        predictions=predictions,
        reasoning=result["reasoning"]
    )
    
    return recommendation

# ── Trend Radar Endpoints ────────────────────────────────────────────────────

@app.get("/api/trend-radar")
async def get_trend_radar(window_days: int = 7):
    """
    Semantic clustering of news articles → detect emerging trends.
    Uses embeddings + DBSCAN + LLM trend naming.
    """
    try:
        result = detect_trends(window_days=window_days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Signal Map Endpoints ─────────────────────────────────────────────────────

@app.get("/api/signal-map")
async def get_signal_map(use_llm: bool = False, min_weight: float = 1.0):
    """
    Entity co-occurrence graph from all stored news.
    Returns D3.js-compatible { nodes, links } for force-directed visualization.
    ?use_llm=true for richer entity extraction (slower, costs ~$0.01 total).
    """
    try:
        result = build_signal_map(use_llm=use_llm, min_weight=min_weight)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Campaign Engine Endpoints ────────────────────────────────────────────────

@app.post("/api/trend-campaign")
async def generate_trend_campaign(trend: Dict[str, Any]):
    """
    Given a trend object (from /api/trend-radar), generate a full campaign:
    brief, segment ranking, LINE message draft.
    """
    try:
        campaign = generate_campaign_from_trend(trend)
        return campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/auto-campaigns")
async def auto_generate_campaigns(top_n: int = 3, window_days: int = 7):
    """
    Full pipeline: detect trends → generate campaigns for top-N trends.
    This is the "money shot" endpoint for the demo.
    """
    try:
        trend_result = detect_trends(window_days=window_days)
        trends = trend_result.get("trends", [])
        if not trends:
            return {"campaigns": [], "message": "No trends detected"}
        campaigns = generate_all_campaigns(trends, top_n=top_n)
        return {
            "campaigns": campaigns,
            "trend_count": len(trends),
            "article_count": trend_result.get("article_count", 0),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

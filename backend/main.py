import os
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
    ImpactEnum, SentimentEnum, UrgencyEnum
)
from news_query import NewsFetcher

load_dotenv()

app = FastAPI(title="SCB Pitching Multi-Agent Backend")

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

# --- Agent 2: Data Strategist ---

def data_strategist_agent(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
    article = state["news_article"]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Data Strategist at SCB. Match the news trend to SCB products and identify the target segment (e.g., Prime, FIRST, Wealth Potential, Upper Mass). Use RAG (simulated) to find the best match."),
        ("human", "News Article: {headline}\nSummary: {summary}\nAffected Products: {products}")
    ])
    
    response = llm.invoke(prompt.format(
        headline=article.headline, 
        summary=article.summary, 
        products=", ".join(article.affectedProducts)
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
            "strategy_note": response.content
        },
        "reasoning": state["reasoning"] + [f"Data Strategist: Matched trend to {segment} segment."]
    }

# --- Agent 3: Copywriter Agent ---

def copywriter_agent(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
    article = state["news_article"]
    brief = state["campaign_brief"]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Copywriter at SCB. Generate a highly localized, engaging Thai ad campaign based on the brief. Focus on urgency, education, or opportunity. Return a JSON matching the Campaign model."),
        ("human", "Context: {news}\nTarget: {segment}")
    ])
    
    chain = prompt | llm.with_structured_output(Campaign)
    campaign = chain.invoke({"news": article.summary, "segment": brief["target_segment"]})
    
    return {
        "campaign_content": campaign,
        "reasoning": state["reasoning"] + ["Copywriter Agent: Generated Thai ad copy variants."]
    }

# --- Agent 4: Performance Predictor ---

def performance_predictor_agent(state: AgentState):
    campaign = state["campaign_content"]
    
    # Predict KPIs based on historical data (simulated)
    ctr = 0.4 
    if state["iterations"] == 0 and "ด่วน" not in campaign.description and "urgent" not in campaign.description.lower():
         ctr = 0.25 # Reject if not urgent enough in Thai or English
    
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

# --- Graph Construction ---

def should_continue(state: AgentState):
    if state["approved"]: return END
    if state["iterations"] >= 3: return END
    return "copywriter"

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

@app.get("/")
async def root():
    return {"message": "SCB Pitching AI Backend is running"}

@app.get("/api/fetch-news")
async def fetch_news(limit: int = 5):
    """Fetch real-world news from various sources"""
    try:
        news = NewsFetcher.get_latest_news(limit=limit)
        return {"news": news}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-campaign", response_model=CampaignRecommendation)
async def generate_campaign(news_input: Dict[str, str]):
    raw_text = news_input.get("text", "")
    if not raw_text:
        raise HTTPException(status_code=400, detail="No news text provided")
    
    initial_state = {
        "raw_news": raw_text,
        "news_article": None,
        "campaign_brief": None,
        "campaign_content": None,
        "performance_forecast": None,
        "reasoning": [],
        "iterations": 0,
        "approved": False
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

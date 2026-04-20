import feedparser
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import datetime
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

class NewsStore:
    """Handles persistent storage of news articles."""
    FILE_PATH = "news_database.json"
    MAX_ARTICLES = 1000

    @classmethod
    def save(cls, news_list: List[Dict]):
        existing = cls.load()
        existing_urls = {n['url'] for n in existing}

        new_count = 0
        for news in news_list:
            if news['url'] not in existing_urls:
                existing.append(news)
                existing_urls.add(news['url'])
                new_count += 1

        # Keep latest MAX_ARTICLES sorted by published date
        existing = sorted(existing, key=lambda x: x.get('published', ''), reverse=True)[:cls.MAX_ARTICLES]

        with open(cls.FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(existing, f, ensure_ascii=False, indent=2)
        return new_count

    @classmethod
    def load(cls) -> List[Dict]:
        if not os.path.exists(cls.FILE_PATH):
            return []
        with open(cls.FILE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)


class NewsFetcher:
    SOURCES = {
        # ── Thai Business & Finance ──────────────────────────────────────────
        "Bangkok Post Business":     "https://www.bangkokpost.com/rss/business.xml",
        "Bangkok Post Finance":      "https://www.bangkokpost.com/rss/finance.xml",
        "Bangkok Post Economy":      "https://www.bangkokpost.com/rss/economy.xml",
        "The Nation Business":       "https://www.nationthailand.com/rss/business",
        "The Nation Economy":        "https://www.nationthailand.com/rss/economy",
        "Prachachat Finance":        "https://www.prachachat.net/category/finance/feed",
        "Prachachat Economy":        "https://www.prachachat.net/category/economy/feed",
        "Khaohoon":                  "https://www.khaohoon.com/feed",
        "ThaiPublica":               "https://thaipublica.org/feed/",
        "PositioningMag":            "https://positioningmag.com/feed",
        "Thairath Business":         "https://www.thairath.co.th/rss/business",
        "Manager Online":            "https://www.manager.co.th/rss",
        "Bangkok Biz News":          "https://www.bangkokbiznews.com/rss/feed.xml",
        "Matichon Economy":          "https://www.matichon.co.th/category/economy/feed",
        "Krungthep Turakij":         "https://www.krungtepturakij.co.th/feed",
        # ── International Finance & Economy ─────────────────────────────────
        "Reuters Business":          "https://feeds.reuters.com/reuters/businessNews",
        "Reuters Finance":           "https://feeds.reuters.com/reuters/financialsMarketsNews",
        "CNBC Top News":             "https://www.cnbc.com/id/100727362/device/rss/rss.html",
        "CNBC Finance":              "https://www.cnbc.com/id/10000664/device/rss/rss.html",
        "CNBC Economy":              "https://www.cnbc.com/id/20910258/device/rss/rss.html",
        "MarketWatch":               "https://feeds.marketwatch.com/marketwatch/topstories/",
        "MarketWatch Economics":     "https://feeds.marketwatch.com/marketwatch/economy-politics/",
        "Yahoo Finance":             "https://finance.yahoo.com/news/rssindex",
        "Investing.com":             "https://www.investing.com/rss/news.rss",
        "Investing.com Asia":        "https://www.investing.com/rss/news_25.rss",
        "Bloomberg Markets":         "https://feeds.bloomberg.com/markets/news.rss",
        "FT Markets":                "https://www.ft.com/rss/home/markets",
        "FT World":                  "https://www.ft.com/rss/home/world",
        "The Economist":             "https://www.economist.com/finance-and-economics/rss.xml",
        "WSJ Markets":               "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
        "WSJ Economy":               "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
        # ── Asia-Pacific Focus ───────────────────────────────────────────────
        "Nikkei Asia":               "https://asia.nikkei.com/rss/feed/nar",
        "SCMP Business":             "https://www.scmp.com/rss/91/feed",
        "SCMP Asia":                 "https://www.scmp.com/rss/4/feed",
        "Channel NewsAsia Business": "https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6811",
        "Straits Times Business":    "https://www.straitstimes.com/rss/business",
        # ── Banking, Interest Rates & Crypto ────────────────────────────────
        "CoinDesk":                  "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "CoinTelegraph":             "https://cointelegraph.com/rss",
        "Seeking Alpha Markets":     "https://seekingalpha.com/market_currents.xml",
        "Zero Hedge":                "https://feeds.feedburner.com/zerohedge/feed",
    }

    @classmethod
    def _fetch_source(cls, name: str, url: str) -> List[Dict]:
        """Fetch a single RSS source. Returns a list of article dicts."""
        articles = []
        try:
            feed = feedparser.parse(url, request_headers={"User-Agent": "Mozilla/5.0"})
            for entry in feed.entries:
                articles.append({
                    "headline": entry.get("title", ""),
                    "summary":  entry.get("summary", entry.get("title", "")),
                    "source":   name,
                    "url":      entry.get("link", ""),
                    "published": entry.get("published", datetime.datetime.now().isoformat()),
                    "timestamp": datetime.datetime.now().isoformat(),
                })
        except Exception as e:
            print(f"[NewsFetcher] Error fetching {name}: {e}")
        return articles

    @classmethod
    def fetch_all(cls, max_workers: int = 12) -> List[Dict]:
        """
        Fetch all RSS sources in parallel and return up to 1000 articles.
        """
        all_articles: List[Dict] = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {
                executor.submit(cls._fetch_source, name, url): name
                for name, url in cls.SOURCES.items()
            }
            for future in as_completed(futures):
                try:
                    all_articles.extend(future.result())
                except Exception as e:
                    print(f"[NewsFetcher] Future error: {e}")

        # Deduplicate by URL
        seen_urls = set()
        unique = []
        for a in all_articles:
            if a["url"] and a["url"] not in seen_urls:
                seen_urls.add(a["url"])
                unique.append(a)

        # Sort newest-first and cap at 1000
        unique.sort(key=lambda x: x.get("published", ""), reverse=True)
        return unique[:1000]

    @classmethod
    def get_50_news(cls) -> List[Dict]:
        """Backward-compatible alias — returns up to 1000 articles now."""
        return cls.fetch_all()


if __name__ == "__main__":
    news = NewsFetcher.fetch_all()
    added = NewsStore.save(news)
    print(f"Fetched {len(news)} articles. Added {added} new ones to database.")

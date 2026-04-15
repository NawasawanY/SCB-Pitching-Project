import feedparser
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import datetime
import json
import os

class NewsStore:
    """Handles persistent storage of news articles."""
    FILE_PATH = "news_database.json"

    @classmethod
    def save(cls, news_list: List[Dict]):
        # Load existing
        existing = cls.load()
        existing_urls = {n['url'] for n in existing}
        
        # Add new (avoid duplicates)
        new_count = 0
        for news in news_list:
            if news['url'] not in existing_urls:
                existing.append(news)
                new_count += 1
        
        # Keep only latest 100 for performance
        existing = sorted(existing, key=lambda x: x.get('published', ''), reverse=True)[:100]
        
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
        "Bangkok Post Business": "https://www.bangkokpost.com/rss/business.xml",
        "Thairath Business": "https://www.thairath.co.th/rss/business",
        "Prachachat": "https://www.prachachat.net/category/finance/feed",
    }

    @classmethod
    def get_50_news(cls):
        all_news = []
        for name, url in cls.SOURCES.items():
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries:
                    all_news.append({
                        "headline": entry.title,
                        "summary": entry.summary if hasattr(entry, 'summary') else entry.title,
                        "source": name,
                        "url": entry.link,
                        "published": entry.published if hasattr(entry, 'published') else datetime.datetime.now().isoformat(),
                        "timestamp": datetime.datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Error {name}: {e}")
        
        return all_news[:50]

if __name__ == "__main__":
    fetcher = NewsFetcher()
    news = fetcher.get_50_news()
    added = NewsStore.save(news)
    print(f"Fetched {len(news)} articles. Added {added} new ones to database.")

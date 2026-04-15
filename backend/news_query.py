import feedparser
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import datetime

class NewsFetcher:
    """
    Fetch real financial news from SET, Thairath, and Bangkok Post.
    Using RSS feeds where available and simple scraping for SET.
    """
    
    SOURCES = {
        "Bangkok Post": "https://www.bangkokpost.com/rss/business.xml",
        "Thairath": "https://www.thairath.co.th/rss/business",
    }
    
    SET_NEWS_URL = "https://www.set.or.th/en/market/news/news-today"

    @classmethod
    def get_latest_news(cls, limit: int = 5) -> List[Dict[str, str]]:
        all_news = []
        
        # 1. Fetch from RSS (Bangkok Post, Thairath)
        for source_name, rss_url in cls.SOURCES.items():
            try:
                feed = feedparser.parse(rss_url)
                for entry in feed.entries[:limit]:
                    all_news.append({
                        "headline": entry.title,
                        "summary": entry.summary if hasattr(entry, 'summary') else entry.title,
                        "source": source_name,
                        "url": entry.link,
                        "published": entry.published if hasattr(entry, 'published') else datetime.datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Error fetching from {source_name}: {e}")

        # 2. Fetch from SET (Scraping today's news)
        try:
            # Note: SET website might have anti-scraping or dynamic content.
            # For a prototype, we'll try to fetch the main news page.
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(cls.SET_NEWS_URL, headers=headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                # SET news entries are usually in tables or specific div classes
                # This is a generic attempt to find links that look like news
                # Specific selectors for SET: div.news-item or similar
                news_items = soup.find_all('div', class_='news-item') or soup.find_all('a', href=True)
                count = 0
                for item in news_items:
                    if count >= limit: break
                    text = item.get_text(strip=True)
                    href = item.get('href')
                    if href and '/news/' in href and len(text) > 30:
                        all_news.append({
                            "headline": text,
                            "summary": text, # SET summary often requires clicking through
                            "source": "SET Announcements",
                            "url": f"https://www.set.or.th{href}" if href.startswith('/') else href,
                            "published": datetime.datetime.now().isoformat()
                        })
                        count += 1
        except Exception as e:
            print(f"Error fetching from SET: {e}")

        return all_news

if __name__ == "__main__":
    # Test fetcher
    news = NewsFetcher.get_latest_news(limit=2)
    for n in news:
        print(f"[{n['source']}] {n['headline'][:50]}...")

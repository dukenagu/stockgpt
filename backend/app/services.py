import httpx
import os
import logging
from typing import Dict, List, Optional, Any
from .models import StockOverview, StockQuote, StockSearchResult, StockSearchResponse
from .utils import format_stock_data, format_quote_data, format_search_results

logger = logging.getLogger(__name__)

class StockService:
    """Service class for handling stock data operations"""
    
    def __init__(self):
#        self.alpha_vantage_key = os.getenv("ALPHA_VANTAGE_KEY", "demo")
        self.alpha_vantage_key = "BQYX29228EUYW7O0"
        self.base_url = "https://www.alphavantage.co/query"
        self.timeout = 30.0
    
    async def get_stock_overview(self, symbol: str) -> Optional[StockOverview]:
        """Get comprehensive stock overview"""
        try:
            params = {
                "function": "OVERVIEW",
                "symbol": symbol.upper(),
                "apikey": self.alpha_vantage_key
            }
            print("Param value: ", params)
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                data = response.json()

                print("Data : ", data)

                if not data or "Symbol" not in data:
                    return None
                
                return StockOverview(**format_stock_data(data))
                
        except httpx.RequestError as e:
            logger.error(f"Request error for stock overview {symbol}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error getting stock overview for {symbol}: {e}")
            return None
    
    async def get_stock_quote(self, symbol: str) -> Optional[StockQuote]:
        """Get real-time stock quote"""
        try:
            params = {
                "function": "GLOBAL_QUOTE",
                "symbol": symbol.upper(),
                "apikey": self.alpha_vantage_key
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                data = response.json()
                
                if "Global Quote" not in data or not data["Global Quote"]:
                    return None
                
                quote_data = format_quote_data(data["Global Quote"])
                return StockQuote(**quote_data)
                
        except httpx.RequestError as e:
            logger.error(f"Request error for stock quote {symbol}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error getting stock quote for {symbol}: {e}")
            return None
    
    async def search_stocks(self, keywords: str) -> StockSearchResponse:
        """Search for stocks by keywords"""
        try:
            params = {
                "function": "SYMBOL_SEARCH",
                "keywords": keywords,
                "apikey": self.alpha_vantage_key
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                data = response.json()
                
                results = []
                if "bestMatches" in data and data["bestMatches"]:
                    results = [
                        StockSearchResult(**format_search_results(match))
                        for match in data["bestMatches"]
                    ]
                
                return StockSearchResponse(
                    search_term=keywords,
                    results=results
                )
                
        except httpx.RequestError as e:
            logger.error(f"Request error for stock search '{keywords}': {e}")
            return StockSearchResponse(search_term=keywords, results=[])
        except Exception as e:
            logger.error(f"Error searching stocks for '{keywords}': {e}")
            return StockSearchResponse(search_term=keywords, results=[])
    
    async def get_multiple_quotes(self, symbols: List[str]) -> Dict[str, Optional[StockQuote]]:
        """Get quotes for multiple stocks (limited by API constraints)"""
        results = {}
        for symbol in symbols[:5]:  # Limit to 5 symbols to avoid rate limiting
            quote = await self.get_stock_quote(symbol)
            results[symbol] = quote
        return results

class CacheService:
    """Simple in-memory cache service to reduce API calls"""
    
    def __init__(self, ttl_seconds: int = 300):  # 5 minutes TTL
        self.cache = {}
        self.ttl = ttl_seconds
    
    def get(self, key: str) -> Optional[Any]:
        """Get item from cache if not expired"""
        if key in self.cache:
            item = self.cache[key]
            if item['expiry'] > self._current_time():
                return item['data']
            else:
                del self.cache[key]  # Remove expired item
        return None
    
    def set(self, key: str, data: Any) -> None:
        """Set item in cache with TTL"""
        self.cache[key] = {
            'data': data,
            'expiry': self._current_time() + self.ttl
        }
    
    def _current_time(self) -> int:
        """Get current time in seconds"""
        import time
        return int(time.time())
    
    def clear(self) -> None:
        """Clear all cache"""
        self.cache.clear()

# Create service instances
stock_service = StockService()
cache_service = CacheService()
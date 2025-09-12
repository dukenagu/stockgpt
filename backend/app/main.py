from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv

from .services import stock_service, cache_service
from .models import StockOverview, StockQuote, StockSearchResponse, APIResponse, ErrorResponse
from .schemas import HealthResponse

load_dotenv()

app = FastAPI(
    title="Stock Information API",
    description="A simple API to get stock market information using Alpha Vantage",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Alpha Vantage API key
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_KEY", "demo")
BASE_URL = "https://www.alphavantage.co/query"

@app.get("/", response_model=APIResponse)
async def root():
    """Root endpoint with API information"""
    return APIResponse(
        success=True,
        message="Stock Information API is running",
        data={
            "version": "1.0.0",
            "endpoints": {
                "stock_info": "/api/stock/{symbol}",
                "stock_quote": "/api/quote/{symbol}",
                "search_stocks": "/api/search/{keywords}",
                "health": "/health"
            }
        }
    )

@app.get("/api/stock/{symbol}", response_model=StockOverview)
async def get_stock_info(symbol: str):
    """Get detailed stock information"""
    # Check cache first
    cache_key = f"overview_{symbol}"
    cached_data = cache_service.get(cache_key)
    if cached_data:
        return cached_data
    
    stock_data = await stock_service.get_stock_overview(symbol)
    if not stock_data:
        raise HTTPException(status_code=404, detail=f"Stock information not found for symbol: {symbol}")
    
    # Cache the result
    cache_service.set(cache_key, stock_data)
    return stock_data

@app.get("/api/quote/{symbol}", response_model=StockQuote)
async def get_stock_quote(symbol: str):
    """Get real-time stock quote"""
    # Check cache first (shorter TTL for quotes)
    cache_key = f"quote_{symbol}"
    cached_data = cache_service.get(cache_key)
    if cached_data:
        return cached_data
    
    quote = await stock_service.get_stock_quote(symbol)
    if not quote:
        raise HTTPException(status_code=404, detail=f"Stock quote not found for symbol: {symbol}")
    
    # Cache the result with shorter TTL (1 minute) for quotes
    cache_service.set(cache_key, quote)
    return quote

@app.get("/api/search/{keywords}", response_model=StockSearchResponse)
async def search_stocks(keywords: str):
    """Search for stocks by keywords"""
    cache_key = f"search_{keywords}"
    cached_data = cache_service.get(cache_key)
    if cached_data:
        return cached_data
    
    results = await stock_service.search_stocks(keywords)
    
    # Cache the result
    cache_service.set(cache_key, results)
    return results

@app.get("/api/batch/quotes", response_model=Dict[str, Optional[StockQuote]])
async def get_batch_quotes(symbols: List[str] = Query(..., description="List of stock symbols")):
    """Get quotes for multiple stocks (max 5 symbols)"""
    if len(symbols) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 symbols allowed per request")
    
    results = await stock_service.get_multiple_quotes(symbols)
    return results

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="stock-api",
        timestamp="2024-01-01T00:00:00Z"  # This would be dynamic in real implementation
    )

@app.get("/cache/clear")
async def clear_cache():
    """Clear all cached data (for development)"""
    cache_service.clear()
    return

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
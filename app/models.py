from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class StockOverview(BaseModel):
    """Model for stock overview data"""
    symbol: str
    name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    exchange: Optional[str] = None
    currency: Optional[str] = None
    country: Optional[str] = None
    
    # Financial metrics
    market_cap: Optional[str] = None
    pe_ratio: Optional[str] = None
    peg_ratio: Optional[str] = None
    dividend_yield: Optional[str] = None
    eps: Optional[str] = None
    beta: Optional[str] = None
    
    # Price metrics
    price: Optional[str] = None
    week_52_high: Optional[str] = None
    week_52_low: Optional[str] = None
    moving_avg_50: Optional[str] = None
    moving_avg_200: Optional[str] = None
    
    class Config:
        from_attributes = True

class StockQuote(BaseModel):
    """Model for real-time stock quote"""
    symbol: str
    price: Optional[float] = None
    change: Optional[float] = None
    change_percent: Optional[str] = None
    volume: Optional[int] = None
    latest_trading_day: Optional[str] = None
    previous_close: Optional[float] = None
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    
    class Config:
        from_attributes = True

class StockSearchResult(BaseModel):
    """Model for stock search results"""
    symbol: str
    name: str
    type: Optional[str] = None
    region: Optional[str] = None
    market_open: Optional[str] = None
    market_close: Optional[str] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None
    match_score: Optional[float] = None
    
    class Config:
        from_attributes = True

class StockSearchResponse(BaseModel):
    """Response model for stock search"""
    search_term: str
    results: List[StockSearchResult]
    
    class Config:
        from_attributes = True

class APIResponse(BaseModel):
    """Generic API response model"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        from_attributes = True

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        from_attributes = True
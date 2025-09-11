from typing import Dict, Any, List, Optional
import re

def format_stock_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """Format raw stock overview data into a more readable format"""
    if not raw_data:
        return {}
    
    # Clean and format the data
    formatted = {
        "symbol": raw_data.get("Symbol", ""),
        "name": raw_data.get("Name", ""),
        "sector": raw_data.get("Sector", ""),
        "industry": raw_data.get("Industry", ""),
        "description": raw_data.get("Description", ""),
        "exchange": raw_data.get("Exchange", ""),
        "currency": raw_data.get("Currency", ""),
        "country": raw_data.get("Country", ""),
        
        # Financial metrics
        "market_cap": raw_data.get("MarketCapitalization", ""),
        "pe_ratio": raw_data.get("PERatio", ""),
        "peg_ratio": raw_data.get("PEGRatio", ""),
        "dividend_yield": raw_data.get("DividendYield", ""),
        "eps": raw_data.get("EPS", ""),
        "beta": raw_data.get("Beta", ""),
        
        # Price metrics
        "price": raw_data.get("Price", ""),
        "week_52_high": raw_data.get("52WeekHigh", ""),
        "week_52_low": raw_data.get("52WeekLow", ""),
        "moving_avg_50": raw_data.get("50DayMovingAverage", ""),
        "moving_avg_200": raw_data.get("200DayMovingAverage", "")
    }
    
    # Clean empty values
    return {k: v for k, v in formatted.items() if v not in [None, "", "None"]}

def format_quote_data(quote_data: Dict[str, Any]) -> Dict[str, Any]:
    """Format raw quote data"""
    if not quote_data:
        return {}
    
    formatted = {
        "symbol": quote_data.get("01. symbol", ""),
        "price": _parse_float(quote_data.get("05. price")),
        "change": _parse_float(quote_data.get("09. change")),
        "change_percent": quote_data.get("10. change percent", ""),
        "volume": _parse_int(quote_data.get("06. volume")),
        "latest_trading_day": quote_data.get("07. latest trading day", ""),
        "previous_close": _parse_float(quote_data.get("08. previous close")),
        "open": _parse_float(quote_data.get("02. open")),
        "high": _parse_float(quote_data.get("03. high")),
        "low": _parse_float(quote_data.get("04. low"))
    }
    
    return {k: v for k, v in formatted.items() if v is not None}

def format_search_results(match_data: Dict[str, Any]) -> Dict[str, Any]:
    """Format stock search results"""
    if not match_data:
        return {}
    
    formatted = {
        "symbol": match_data.get("1. symbol", ""),
        "name": match_data.get("2. name", ""),
        "type": match_data.get("3. type", ""),
        "region": match_data.get("4. region", ""),
        "market_open": match_data.get("5. marketOpen", ""),
        "market_close": match_data.get("6. marketClose", ""),
        "timezone": match_data.get("7. timezone", ""),
        "currency": match_data.get("8. currency", ""),
        "match_score": _parse_float(match_data.get("9. matchScore", ""))
    }
    
    return {k: v for k, v in formatted.items() if v not in [None, "", "None"]}

def _parse_float(value: Any) -> Optional[float]:
    """Safely parse float values"""
    if value is None or value == "None" or value == "":
        return None
    try:
        # Remove any non-numeric characters except decimal point and minus sign
        cleaned = re.sub(r'[^\d.-]', '', str(value))
        return float(cleaned)
    except (ValueError, TypeError):
        return None

def _parse_int(value: Any) -> Optional[int]:
    """Safely parse integer values"""
    if value is None or value == "None" or value == "":
        return None
    try:
        # Remove any non-numeric characters
        cleaned = re.sub(r'[^\d]', '', str(value))
        return int(cleaned)
    except (ValueError, TypeError):
        return None

def validate_symbol(symbol: str) -> bool:
    """Validate stock symbol format"""
    if not symbol or not isinstance(symbol, str):
        return False
    # Basic validation: 1-5 uppercase letters
    return bool(re.match(r'^[A-Z]{1,5}$', symbol.upper()))

def format_error_message(error: Exception) -> str:
    """Format error message for API responses"""
    error_msg = str(error)
    # Hide sensitive information
    if "apikey" in error_msg.lower():
        return "API configuration error"
    return error_msg
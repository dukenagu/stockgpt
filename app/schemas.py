from pydantic import BaseModel
from typing import Optional

class StockRequest(BaseModel):
    symbol: str

class SearchRequest(BaseModel):
    keywords: str

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str
    version: str = "1.0.0"
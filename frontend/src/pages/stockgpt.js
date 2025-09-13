// StockGPT React Frontend
import React, { useState } from 'react';
// import { FaChartLine, FaRobot, FaSearch, FaArrowUp, FaArrowDown, FaStar } from 'react-icons/fa';
import { ChartBarIcon, MagnifyingGlassIcon, HomeIcon, RocketLaunchIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import '../styles/stockgpt.css';

const StockGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // This would call your Python backend API
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.analysis,
        stockData: data.stock_data
      }]);
      
      if (data.stock_data) {
        setStockData(data.stock_data);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    }
    
    setLoading(false);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestedQueries = [
    "What's the current price of AAPL?",
    "Analyze Tesla's financial health",
    // "Compare MSFT and GOOGL",
    // "What are the best dividend stocks?",
    // "Show me technical indicators for NVDA"
  ];

  return (
    <div className="stockgpt-container">
      {/* Header
      <header className="stockgpt-header">
        <div className="logo">
          <FaChartLine className="logo-icon" />
          <h1>StockGPT</h1>
        </div>
        <p>AI-powered stock analysis and insights</p>
      </header> */}

      <div className="stockgpt-layout">
        {/* Main Chat Area */}
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">
                {/* <RocketLaunchIcon /> */}
              </div>
              <h2>Welcome to StockGPT</h2>
              <p>Ask me anything about stocks, financial analysis, or market trends</p>
              
              <div className="suggested-queries">
                <h3>Try asking:</h3>
                {suggestedQueries.map((query, index) => (
                  <div 
                    key={index} 
                    className="suggestion-card"
                    onClick={() => setInput(query)}
                  >
                    {/* <FaSearch className="suggestion-icon" /> */}
                    <span>{query}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-content">
                    {message.role === 'assistant' && (
                      <div className="assistant-avatar">
                        {/* <FaRobot /> */}
                      </div>
                    )}
                    <div className="message-text">
                      {message.content}
                      
                      {message.stockData && (
                        <div className="stock-data-preview">
                          <h4>{message.stockData.symbol} - {message.stockData.companyName}</h4>
                          <div className="price-info">
                            <span className={`price ${message.stockData.change >= 0 ? 'up' : 'down'}`}>
                              ${message.stockData.latestPrice}
                            </span>
                            <span className={`change ${message.stockData.change >= 0 ? 'up' : 'down'}`}>
                              {/* {message.stockData.change >= 0 ? <FaArrowUp /> : <FaArrowDown />} */}
                              {Math.abs(message.stockData.change)} ({Math.abs(message.stockData.changePercent)}%)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="message assistant">
                  <div className="message-content">
                    <div className="assistant-avatar">
                      {/* <FaRobot /> */}
                    </div>
                    <div className="message-text">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about any stock or financial analysis..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              {/* <FaArrowUp /> */}
            </button>
          </div>
        </div>

        {/* Stock Data Sidebar */}
        <div className="sidebar">
          {stockData ? (
            <div className="stock-details">
              <h2>{stockData.symbol}</h2>
              <h3>{stockData.companyName}</h3>
              
              <div className="price-section">
                <div className={`current-price ${stockData.change >= 0 ? 'up' : 'down'}`}>
                  ${stockData.latestPrice}
                </div>
                <div className={`price-change ${stockData.change >= 0 ? 'up' : 'down'}`}>
                  {/* {stockData.change >= 0 ? <FaArrowUp /> : <FaArrowDown />} */}
                  {Math.abs(stockData.change)} ({Math.abs(stockData.changePercent)}%)
                </div>
              </div>
              
              <div className="stock-stats">
                <div className="stat">
                  <label>Open</label>
                  <span>${stockData.open}</span>
                </div>
                <div className="stat">
                  <label>High</label>
                  <span>${stockData.high}</span>
                </div>
                <div className="stat">
                  <label>Low</label>
                  <span>${stockData.low}</span>
                </div>
                <div className="stat">
                  <label>Volume</label>
                  <span>{stockData.volume.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <label>Market Cap</label>
                  <span>${(stockData.marketCap / 1e9).toFixed(2)}B</span>
                </div>
                <div className="stat">
                  <label>PE Ratio</label>
                  <span>{stockData.peRatio || 'N/A'}</span>
                </div>
              </div>
              
              <div className="analysis-section">
                <h3>AI Analysis</h3>
                <div className="analysis-score">
                  <div className="score-label">Investment Potential</div>
                  <div className="score-value">
                    <div className="stars">
                      {/* {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          className={star <= Math.round(stockData.analysisScore || 3) ? 'filled' : ''} 
                        />
                      ))} */}
                    </div>
                    <span>{stockData.analysisScore}/5</span>
                  </div>
                </div>
                
                <div className="sentiment">
                  <label>Market Sentiment</label>
                  <div className={`sentiment-value ${stockData.sentiment}`}>
                    {stockData.sentiment}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sidebar-placeholder">
              {/* <FaChartLine className="placeholder-icon" /> */}
              <p>Stock data will appear here after analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockGPT;
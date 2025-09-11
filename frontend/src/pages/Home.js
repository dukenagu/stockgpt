import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stockAPI } from '../services/api';
import { ArrowTrendingUpIcon, ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [popularStocks, setPopularStocks] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularStocks = async () => {
      try {
        const quotesData = {};
        for (const symbol of popularStocks) {
          try {
            const quote = await stockAPI.getStockQuote(symbol);
            quotesData[symbol] = quote;
          } catch (error) {
            console.error(`Failed to fetch ${symbol}:`, error);
          }
        }
        setQuotes(quotesData);
      } catch (error) {
        console.error('Error fetching popular stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStocks();
  }, [popularStocks]);

  const getPriceChangeClass = (change) => {
    if (change === undefined || change === null) return 'price-neutral';
    return change >= 0 ? 'price-up' : 'price-down';
  };

  const getChangeIndicatorClass = (change) => {
    if (change === undefined || change === null) return 'stock-change-indicator bg-gray-100 text-gray-800';
    return change >= 0 ? 'stock-change-positive' : 'stock-change-negative';
  };

  return (
    <div className="max-w-6xl mx-auto fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-shadow">
          Stock Market Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real-time stock data, analytics, and insights powered by AI
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/search"
            className="btn-primary"
          >
            <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
            Search Stocks
          </Link>
        </div>
      </div>

      {/* Popular Stocks Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-primary-600" />
          Popular Stocks
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner h-12 w-12 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stock data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularStocks.map((symbol) => {
              const quote = quotes[symbol];
              const change = quote?.change;

              return (
                <Link
                  key={symbol}
                  to={`/stock/${symbol}`}
                  className="stock-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{symbol}</h3>
                    {quote && (
                      <span className={getChangeIndicatorClass(change)}>
                        {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {quote ? (
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${quote.price}
                      </p>
                      <p className={`text-sm ${getPriceChangeClass(change)}`}>
                        {quote.change_percent}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Volume: {quote.volume?.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Data not available</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 card-hover">
          <ArrowTrendingUpIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
          <p className="text-gray-600">Get live stock prices and market data updated in real-time</p>
        </div>
        
        <div className="text-center p-6 card-hover">
          <ChartBarIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
          <p className="text-gray-600">Comprehensive financial metrics and performance indicators</p>
        </div>
        
        <div className="text-center p-6 card-hover">
          <MagnifyingGlassIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-600">Find stocks by company name, symbol, or industry</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { stockAPI } from '../services/api';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [overview, quoteData] = await Promise.all([
          stockAPI.getStockOverview(symbol),
          stockAPI.getStockQuote(symbol)
        ]);
        
        setStockData(overview);
        setQuote(quoteData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading {symbol} data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {stockData?.name} ({stockData?.symbol})
            </h1>
            <p className="text-gray-600">{stockData?.sector} • {stockData?.industry}</p>
          </div>
          
          {quote && (
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ${quote.price}
              </div>
              <div className={`flex items-center justify-end ${
                quote.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {quote.change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-5 w-5 mr-1" />
                )}
                <span>
                  {quote.change} ({quote.change_percent})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Metrics */}
      {stockData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="space-y-3">
              <MetricItem label="Market Cap" value={stockData.market_cap} />
              <MetricItem label="P/E Ratio" value={stockData.pe_ratio} />
              <MetricItem label="EPS" value={stockData.eps} />
              <MetricItem label="Dividend Yield" value={stockData.dividend_yield} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Price Ranges</h2>
            <div className="space-y-3">
              <MetricItem label="52 Week High" value={stockData.week_52_high} />
              <MetricItem label="52 Week Low" value={stockData.week_52_low} />
              <MetricItem label="50 Day MA" value={stockData.moving_avg_50} />
              <MetricItem label="200 Day MA" value={stockData.moving_avg_200} />
            </div>
          </div>
        </div>
      )}

      {/* Company Description */}
      {stockData?.description && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{stockData.description}</p>
        </div>
      )}
    </div>
  );
};

const MetricItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default StockDetail;
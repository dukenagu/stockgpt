import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { stockAPI } from '../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await stockAPI.searchStocks(query);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Stocks</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter company name or symbol..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching stocks...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
            {results.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stock/${stock.symbol}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
                    <p className="text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{stock.region}</p>
                    <p className="text-sm text-gray-500">{stock.currency}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query && !loading && (
          <div className="text-center py-8 text-gray-500">
            No stocks found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
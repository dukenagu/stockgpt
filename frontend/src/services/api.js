import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const stockAPI = {
  // Get stock overview
  getStockOverview: async (symbol) => {
    try {
      const response = await api.get(`/api/stock/${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch stock data');
    }
  },

  // Get stock quote
  getStockQuote: async (symbol) => {
    try {
      const response = await api.get(`/api/quote/${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch stock quote');
    }
  },

  // Search stocks
  searchStocks: async (keywords) => {
    try {
      const response = await api.get(`/api/search/${keywords}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to search stocks');
    }
  },

  // Get health status
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API is not available');
    }
  },
};

export default api;
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const usePortfolioData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(15);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use relative URL - works on same domain automatically
      const response = await axios.get('/api/portfolio', {
        timeout: 15000,
        headers: { Accept: 'application/json' },
      });
      
      setData(response.data);
      setLastUpdated(new Date());
      setCountdown(15);
    } catch (err: any) {
      console.error('Portfolio fetch failed:', err.message);
      setError(err.response?.data?.error || 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 15000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    countdown,
    refetch: fetchPortfolio,
  };
};

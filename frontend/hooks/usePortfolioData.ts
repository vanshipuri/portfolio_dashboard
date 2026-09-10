import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const usePortfolioData = () => {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(15);

  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Relative URL works for monorepo (same domain)
      const response = await axios.get('/api/portfolio', {
        timeout: 15000,
        headers: { Accept: 'application/json' },
      });
      
      setPortfolio(response.data?.portfolio || null);
      setMeta(response.data?.meta || null);
      setLastUpdated(new Date());
      setCountdown(15);
    } catch (err: any) {
      console.error('Portfolio fetch failed:', err.message);
      setError(err.response?.data?.error || 'Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
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

  // Backward-compatible return shape matching app/page.tsx expectations
  return {
    portfolio,
    meta,
    isLoading,
    error,
    lastUpdated,
    countdown,
    refetch: fetchPortfolio,
    
    // Aliases for safety in case page uses either naming
    data: portfolio,
    loading: isLoading,
  };
};

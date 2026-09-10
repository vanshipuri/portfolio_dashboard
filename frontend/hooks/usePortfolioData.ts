import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/*
 * In monorepo deployment, frontend and API are on SAME DOMAIN.
 * 
 * Strategy:
 * 1. If NEXT_PUBLIC_API_URL is set explicitly → use it
 * 2. Otherwise → use current browser origin (relative /api/... works)
 * 3. Fallback for SSR/build-time → empty string
 */
const getApiUrl = (): string => {
  // Explicit env var takes priority (for split deployments)
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== '') {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Monorepo: same domain as frontend
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Build-time fallback
  return '';
};

export const usePortfolioData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(15);

  const apiUrl = getApiUrl();

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[usePortfolioData] Fetching from:', `${apiUrl}/api/portfolio`);
      
      const response = await axios.get(`${apiUrl}/api/portfolio`, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('[usePortfolioData] Response status:', response.status);
      
      setData(response.data);
      setLastUpdated(new Date());
      setCountdown(15);
    } catch (err: any) {
      console.error('[usePortfolioData] Error:', err.message);
      console.error('[usePortfolioData] Config:', err.config?.url);
      console.error('[usePortfolioData] Response:', err.response?.status, err.response?.data);
      
      let errorMessage = 'Failed to fetch portfolio data';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out - server may be starting up';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found - check deployment';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Network error - check CORS and API URL';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 15000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 15;
        return prev - 1;
      });
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

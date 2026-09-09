"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import type { PortfolioApiResponse } from "../types/portfolio.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const REFRESH_INTERVAL_SECONDS = 15;

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_SECONDS);

  const isFetchingRef = useRef(false);

  const fetchPortfolio = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;

      const response = await axios.get<PortfolioApiResponse>(
        `${API_BASE_URL}/portfolio`
      );

      setData(response.data);
      setError(null);
      setCountdown(REFRESH_INTERVAL_SECONDS);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("Something went wrong while fetching portfolio data.");
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      fetchPortfolio();
    }, REFRESH_INTERVAL_SECONDS * 1000);

    const countdownTimer = window.setInterval(() => {
      setCountdown((previous) =>
        previous <= 1 ? REFRESH_INTERVAL_SECONDS : previous - 1
      );
    }, 1000);

    return () => {
      window.clearInterval(refreshTimer);
      window.clearInterval(countdownTimer);
    };
  }, [fetchPortfolio]);

  return {
    data,
    portfolio: data?.portfolio ?? null,
    meta: data?.meta ?? null,
    isLoading,
    error,
    countdown,
    refetch: fetchPortfolio
  };
}
import axios from "axios";
import { cacheManager } from "../cache/cacheManager";
import { PriceResult, RawStock } from "../types/portfolio.types";
import { getYahooSymbolCandidates } from "../utils/symbolResolver";

const PRICE_CACHE_TTL_MS = 15 * 1000;

async function fetchSingleYahooSymbol(
  yahooSymbol: string
): Promise<number> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    },
    timeout: 5000
  });

  const price =
    response.data?.chart?.result?.[0]?.meta?.regularMarketPrice;

  if (typeof price !== "number") {
    throw new Error(`No valid CMP found for ${yahooSymbol}`);
  }

  return price;
}

export async function fetchCMPForStock(
  stock: RawStock
): Promise<PriceResult> {
  const cacheKey = `price:${stock.id}:${stock.yahooSymbol || stock.nseSymbol || stock.bseCode}`;

  const cached = cacheManager.get<PriceResult>(cacheKey);

  if (cached) {
    return {
      ...cached,
      source: "cache"
    };
  }

  const candidates = getYahooSymbolCandidates(stock);
  const fetchedAt = new Date().toISOString();

  if (candidates.length === 0) {
    return {
      symbol: stock.name,
      cmp: null,
      status: "failed",
      source: "unavailable",
      error: "No Yahoo/NSE/BSE symbol available",
      fetchedAt
    };
  }

  for (const candidate of candidates) {
    try {
      const cmp = await fetchSingleYahooSymbol(candidate);

      const result: PriceResult = {
        symbol: candidate,
        cmp,
        status: "success",
        source: "yahoo-finance",
        error: null,
        fetchedAt
      };

      cacheManager.set(cacheKey, result, PRICE_CACHE_TTL_MS);

      return result;
    } catch (error) {
      // Try next candidate
    }
  }

  const failedResult: PriceResult = {
    symbol: candidates[0],
    cmp: null,
    status: "failed",
    source: "unavailable",
    error: `Unable to fetch CMP from Yahoo for: ${candidates.join(", ")}`,
    fetchedAt
  };

  cacheManager.set(cacheKey, failedResult, PRICE_CACHE_TTL_MS);

  return failedResult;
}

export async function fetchCMPForStocks(
  stocks: RawStock[]
): Promise<Map<number, PriceResult>> {
  const results = new Map<number, PriceResult>();

  const fetchJobs = stocks.map((stock) => fetchCMPForStock(stock));

  const settledResults = await Promise.allSettled(fetchJobs);

  settledResults.forEach((result, index) => {
    const stock = stocks[index];

    if (result.status === "fulfilled") {
      results.set(stock.id, result.value);
    } else {
      results.set(stock.id, {
        symbol: stock.name,
        cmp: null,
        status: "failed",
        source: "unavailable",
        error: result.reason?.message || "Unknown Yahoo fetch error",
        fetchedAt: new Date().toISOString()
      });
    }
  });

  return results;
}
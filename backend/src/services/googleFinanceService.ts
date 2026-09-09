import fundamentalsData from "../data/fundamentals.json";
import { cacheManager } from "../cache/cacheManager";
import {
  FundamentalsResult,
  RawStock
} from "../types/portfolio.types";

const FUNDAMENTALS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type FundamentalsRecord = {
  peRatio: number | null;
  latestEarnings: number | null;
  source: string;
};

const fundamentalsMap = fundamentalsData as Record<string, FundamentalsRecord>;

function getFundamentalsKey(stock: RawStock): string | null {
  if (stock.nseSymbol) {
    return stock.nseSymbol;
  }

  if (stock.bseCode) {
    return stock.bseCode;
  }

  return null;
}

export async function fetchFundamentalsForStock(
  stock: RawStock
): Promise<FundamentalsResult> {
  const key = getFundamentalsKey(stock);
  const fetchedAt = new Date().toISOString();

  if (!key) {
    return {
      symbol: stock.name,
      peRatio: null,
      latestEarnings: null,
      status: "failed",
      source: "unavailable",
      error: "No NSE/BSE symbol available for fundamentals lookup",
      fetchedAt
    };
  }

  const cacheKey = `fundamentals:${key}`;

  const cached = cacheManager.get<FundamentalsResult>(cacheKey);

  if (cached) {
    return cached;
  }

  const fallback = fundamentalsMap[key];

  if (!fallback) {
    return {
      symbol: key,
      peRatio: null,
      latestEarnings: null,
      status: "failed",
      source: "unavailable",
      error: "No fallback fundamentals found",
      fetchedAt
    };
  }

  const result: FundamentalsResult = {
    symbol: key,
    peRatio: fallback.peRatio,
    latestEarnings: fallback.latestEarnings,
    status: "success",
    source: "static-assignment-data",
    error: null,
    fetchedAt
  };

  cacheManager.set(cacheKey, result, FUNDAMENTALS_CACHE_TTL_MS);

  return result;
}

export async function fetchFundamentalsForStocks(
  stocks: RawStock[]
): Promise<Map<number, FundamentalsResult>> {
  const results = new Map<number, FundamentalsResult>();

  const jobs = stocks.map((stock) => fetchFundamentalsForStock(stock));

  const settledResults = await Promise.allSettled(jobs);

  settledResults.forEach((result, index) => {
    const stock = stocks[index];

    if (result.status === "fulfilled") {
      results.set(stock.id, result.value);
    } else {
      results.set(stock.id, {
        symbol: stock.name,
        peRatio: null,
        latestEarnings: null,
        status: "failed",
        source: "unavailable",
        error: result.reason?.message || "Unknown fundamentals error",
        fetchedAt: new Date().toISOString()
      });
    }
  });

  return results;
}
export type FetchStatus = "success" | "failed";

export type PriceSource =
  | "yahoo-finance"
  | "cache"
  | "unavailable";

export type FundamentalsSource =
  | "google-finance-live"
  | "static-assignment-data"
  | "unavailable";

export interface Stock {
  id: number;
  name: string;
  purchasePrice: number;
  quantity: number;
  investment: number;

  nseSymbol: string | null;
  bseCode: string | null;
  sourceNseBseCode: string;
  yahooSymbol: string | null;
  googleFinanceSymbol: string | null;
  exchange: "NSE" | "BSE" | "UNKNOWN";

  portfolioPercentage: number;

  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;

  peRatio: number | null;
  latestEarnings: number | null;

  priceStatus: FetchStatus;
  priceError: string | null;
  priceSource: PriceSource;

  fundamentalsStatus: FetchStatus;
  fundamentalsError: string | null;
  fundamentalsSource: FundamentalsSource;

  notes?: string;
}

export interface Sector {
  sector: string;
  sectorInvestment: number;
  sectorPortfolioPercentage: number;

  totalPresentValue: number | null;
  totalGainLoss: number | null;
  totalGainLossPercent: number | null;

  stocks: Stock[];
}

export interface PortfolioSummary {
  sectors: Sector[];
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainLoss: number | null;
  totalGainLossPercent: number | null;
}

export interface PortfolioApiResponse {
  portfolio: PortfolioSummary;
  meta: {
    lastUpdated: string;
    refreshIntervalSeconds: number;
    priceSource: string;
    fundamentalsSource: string;
    activeHoldingsCount: number;
    excludedRowsCount: number;
    warnings: string[];
  };
}
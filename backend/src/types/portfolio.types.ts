export type Exchange = "NSE" | "BSE" | "UNKNOWN";

export type FetchStatus = "success" | "failed";

export type PriceSource =
  | "yahoo-finance"
  | "cache"
  | "unavailable";

export type FundamentalsSource =
  | "google-finance-live"
  | "static-assignment-data"
  | "unavailable";

export interface SourceMetadata {
  sourceFile: string;
  activePortfolioTotal: number;
  activeHoldingsCount: number;
  excludedRowsCount: number;
  currency: string;
  dataEntryNote: string;
}

export interface RawStock {
  id: number;
  name: string;
  purchasePrice: number;
  quantity: number;
  investment: number;

  nseSymbol: string | null;
  bseCode: string | null;
  sourceNseBseCode: string;

  yahooSymbol: string | null;
  fallbackYahooSymbols: string[];

  googleFinanceSymbol: string | null;
  exchange: Exchange;

  notes?: string;
}

export interface RawSector {
  sector: string;
  sectorInvestment: number;
  stocks: RawStock[];
}

export interface ExcludedStock {
  id: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  nseSymbol: string | null;
  bseCode: string | null;
  sourceNseBseCode: string;
  yahooSymbol: string | null;
  fallbackYahooSymbols: string[];
  googleFinanceSymbol: string | null;
  exchange: Exchange;
  reason: string;
  notes?: string;
}

export interface PortfolioDataFile {
  sourceMetadata: SourceMetadata;
  activeHoldings: RawSector[];
  excludedRows: ExcludedStock[];
}

export interface PriceResult {
  symbol: string;
  cmp: number | null;
  status: FetchStatus;
  source: PriceSource;
  error: string | null;
  fetchedAt: string;
}

export interface FundamentalsResult {
  symbol: string;
  peRatio: number | null;
  latestEarnings: number | null;
  status: FetchStatus;
  source: FundamentalsSource;
  error: string | null;
  fetchedAt: string;
}

export interface CalculatedStock extends RawStock {
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
}

export interface CalculatedSector {
  sector: string;
  sectorInvestment: number;
  sectorPortfolioPercentage: number;

  totalPresentValue: number | null;
  totalGainLoss: number | null;
  totalGainLossPercent: number | null;

  stocks: CalculatedStock[];
}

export interface PortfolioSummary {
  sectors: CalculatedSector[];
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
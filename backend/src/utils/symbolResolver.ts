import { RawStock } from "../types/portfolio.types";

export function getYahooSymbolCandidates(stock: RawStock): string[] {
  const candidates = new Set<string>();

  if (stock.yahooSymbol) {
    candidates.add(stock.yahooSymbol);
  }

  if (stock.nseSymbol) {
    candidates.add(`${stock.nseSymbol}.NS`);
  }

  if (stock.bseCode) {
    candidates.add(`${stock.bseCode}.BO`);
  }

  for (const fallbackSymbol of stock.fallbackYahooSymbols || []) {
    candidates.add(fallbackSymbol);
  }

  return Array.from(candidates);
}

export function getDisplayExchangeCode(stock: RawStock): string {
  if (stock.sourceNseBseCode) {
    return stock.sourceNseBseCode;
  }

  if (stock.nseSymbol) {
    return stock.nseSymbol;
  }

  if (stock.bseCode) {
    return stock.bseCode;
  }

  return "N/A";
}
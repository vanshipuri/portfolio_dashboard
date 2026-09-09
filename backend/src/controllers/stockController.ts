import type { Request, Response, NextFunction } from "express";
import { buildPortfolioResponse } from "../services/portfolioService";
import { fetchCMPForStocks } from "../services/yahooFinanceService";
import { fetchFundamentalsForStock } from "../services/googleFinanceService";
import type { RawStock } from "../types/portfolio.types";

function createLookupStock(symbolInput: string, id: number): RawStock {
  const cleanedSymbol = symbolInput.trim().toUpperCase();

  const isYahooSymbol =
    cleanedSymbol.endsWith(".NS") || cleanedSymbol.endsWith(".BO");

  const isBseCode = /^\d{6}$/.test(cleanedSymbol);

  const plainSymbol = cleanedSymbol
    .replace(".NS", "")
    .replace(".BO", "");

  return {
    id,
    name: plainSymbol,
    purchasePrice: 0,
    quantity: 0,
    investment: 0,
    nseSymbol: isBseCode ? null : plainSymbol,
    bseCode: isBseCode ? plainSymbol : null,
    sourceNseBseCode: plainSymbol,
    yahooSymbol: isYahooSymbol
      ? cleanedSymbol
      : isBseCode
        ? `${plainSymbol}.BO`
        : `${plainSymbol}.NS`,
    fallbackYahooSymbols: [],
    googleFinanceSymbol: isBseCode
      ? `BOM:${plainSymbol}`
      : `NSE:${plainSymbol}`,
    exchange: isBseCode ? "BSE" : "NSE"
  };
}

export async function getPortfolioData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const portfolioResponse = await buildPortfolioResponse();
    res.status(200).json(portfolioResponse);
  } catch (error) {
    next(error);
  }
}

export async function getPrices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const symbolsQuery = req.query.symbols;

    if (!symbolsQuery || typeof symbolsQuery !== "string") {
      res.status(400).json({
        error: "Missing required query parameter: symbols",
        example: "/api/prices?symbols=HDFCBANK,BAJFINANCE"
      });
      return;
    }

    const symbols = symbolsQuery
      .split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean);

    if (symbols.length === 0) {
      res.status(400).json({
        error: "Please provide at least one valid symbol"
      });
      return;
    }

    const lookupStocks = symbols.map((symbol, index) =>
      createLookupStock(symbol, index + 1)
    );

    const priceMap = await fetchCMPForStocks(lookupStocks);

    res.status(200).json({
      data: Array.from(priceMap.values()),
      meta: {
        requestedSymbols: symbols,
        count: symbols.length,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getFundamentals(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const symbolQuery = req.query.symbol;

    if (!symbolQuery || typeof symbolQuery !== "string") {
      res.status(400).json({
        error: "Missing required query parameter: symbol",
        example: "/api/fundamentals?symbol=HDFCBANK"
      });
      return;
    }

    const lookupStock = createLookupStock(symbolQuery, 1);
    const fundamentals = await fetchFundamentalsForStock(lookupStock);

    res.status(200).json({
      data: fundamentals,
      meta: {
        requestedSymbol: symbolQuery,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}
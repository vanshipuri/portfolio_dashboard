import portfolioDataJson from "../data/portfolio.json";
import {
  CalculatedSector,
  CalculatedStock,
  PortfolioApiResponse,
  PortfolioDataFile,
  RawStock
} from "../types/portfolio.types";
import {
  calculateGainLoss,
  calculateGainLossPercent,
  calculatePortfolioPercentage,
  calculatePresentValue,
  roundToTwo,
  sumNumbers
} from "../utils/calculations";
import { fetchCMPForStocks } from "./yahooFinanceService";
import { fetchFundamentalsForStocks } from "./googleFinanceService";

const portfolioData = portfolioDataJson as PortfolioDataFile;

function flattenStocks(): RawStock[] {
  return portfolioData.activeHoldings.flatMap((sector) => sector.stocks);
}

export async function buildPortfolioResponse(): Promise<PortfolioApiResponse> {
  const allStocks = flattenStocks();

  const totalInvestment = sumNumbers(
    allStocks.map((stock) => stock.investment)
  );

  const [priceResults, fundamentalsResults] = await Promise.all([
    fetchCMPForStocks(allStocks),
    fetchFundamentalsForStocks(allStocks)
  ]);

  const calculatedSectors: CalculatedSector[] =
    portfolioData.activeHoldings.map((sector) => {
      const calculatedStocks: CalculatedStock[] = sector.stocks.map((stock) => {
        const priceResult = priceResults.get(stock.id);
        const fundamentalsResult = fundamentalsResults.get(stock.id);

        const cmp = priceResult?.cmp ?? null;

        const presentValue = calculatePresentValue(
          cmp,
          stock.quantity
        );

        const gainLoss = calculateGainLoss(
          presentValue,
          stock.investment
        );

        const gainLossPercent = calculateGainLossPercent(
          gainLoss,
          stock.investment
        );

        return {
          ...stock,
          portfolioPercentage: roundToTwo(
            calculatePortfolioPercentage(stock.investment, totalInvestment)
          ),

          cmp,
          presentValue: presentValue === null ? null : roundToTwo(presentValue),
          gainLoss: gainLoss === null ? null : roundToTwo(gainLoss),
          gainLossPercent:
            gainLossPercent === null ? null : roundToTwo(gainLossPercent),

          peRatio: fundamentalsResult?.peRatio ?? null,
          latestEarnings: fundamentalsResult?.latestEarnings ?? null,

          priceStatus: priceResult?.status ?? "failed",
          priceError: priceResult?.error ?? "Price result unavailable",
          priceSource: priceResult?.source ?? "unavailable",

          fundamentalsStatus: fundamentalsResult?.status ?? "failed",
          fundamentalsError:
            fundamentalsResult?.error ?? "Fundamentals result unavailable",
          fundamentalsSource:
            fundamentalsResult?.source ?? "unavailable"
        };
      });

      const validPresentValues = calculatedStocks
        .map((stock) => stock.presentValue)
        .filter((value): value is number => value !== null);

      const totalPresentValue =
        validPresentValues.length === 0
          ? null
          : sumNumbers(validPresentValues);

      const totalGainLoss =
        totalPresentValue === null
          ? null
          : totalPresentValue - sector.sectorInvestment;

      const totalGainLossPercent =
        totalGainLoss === null
          ? null
          : calculateGainLossPercent(totalGainLoss, sector.sectorInvestment);

      return {
        sector: sector.sector,
        sectorInvestment: sector.sectorInvestment,
        sectorPortfolioPercentage: roundToTwo(
          calculatePortfolioPercentage(
            sector.sectorInvestment,
            totalInvestment
          )
        ),
        totalPresentValue:
          totalPresentValue === null ? null : roundToTwo(totalPresentValue),
        totalGainLoss:
          totalGainLoss === null ? null : roundToTwo(totalGainLoss),
        totalGainLossPercent:
          totalGainLossPercent === null
            ? null
            : roundToTwo(totalGainLossPercent),
        stocks: calculatedStocks
      };
    });

  const validPortfolioPresentValues = calculatedSectors
    .map((sector) => sector.totalPresentValue)
    .filter((value): value is number => value !== null);

  const totalPresentValue =
    validPortfolioPresentValues.length === 0
      ? null
      : sumNumbers(validPortfolioPresentValues);

  const totalGainLoss =
    totalPresentValue === null
      ? null
      : totalPresentValue - totalInvestment;

  const totalGainLossPercent =
    totalGainLoss === null
      ? null
      : calculateGainLossPercent(totalGainLoss, totalInvestment);

  return {
    portfolio: {
      sectors: calculatedSectors,
      totalInvestment,
      totalPresentValue:
        totalPresentValue === null ? null : roundToTwo(totalPresentValue),
      totalGainLoss:
        totalGainLoss === null ? null : roundToTwo(totalGainLoss),
      totalGainLossPercent:
        totalGainLossPercent === null
          ? null
          : roundToTwo(totalGainLossPercent)
    },
    meta: {
      lastUpdated: new Date().toISOString(),
      refreshIntervalSeconds: 15,
      priceSource: "Yahoo Finance unofficial chart endpoint",
      fundamentalsSource: "Google Finance strategy with static assignment fallback",
      activeHoldingsCount: allStocks.length,
      excludedRowsCount: portfolioData.excludedRows.length,
      warnings: []
    }
  };
}
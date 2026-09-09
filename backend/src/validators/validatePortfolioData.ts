import portfolioDataJson from "../data/portfolio.json";
import type { PortfolioDataFile } from "../types/portfolio.types";

const portfolioData = portfolioDataJson as PortfolioDataFile;

const EXPECTED_TOTAL_INVESTMENT = 1543060;
const EXPECTED_ACTIVE_HOLDINGS_COUNT = 26;
const EXPECTED_EXCLUDED_ROWS_COUNT = 3;

const errors: string[] = [];

function addError(message: string): void {
  errors.push(message);
}

function assertEqual(
  label: string,
  actual: number,
  expected: number
): void {
  if (actual !== expected) {
    addError(`${label}: expected ${expected}, got ${actual}`);
  }
}

function validateStockInvestments(): void {
  for (const sector of portfolioData.activeHoldings) {
    for (const stock of sector.stocks) {
      const calculatedInvestment = stock.purchasePrice * stock.quantity;

      if (calculatedInvestment !== stock.investment) {
        addError(
          `${stock.name}: investment mismatch. ` +
            `Expected ${calculatedInvestment}, got ${stock.investment}`
        );
      }
    }
  }
}

function validateSectorTotals(): void {
  for (const sector of portfolioData.activeHoldings) {
    const calculatedSectorInvestment = sector.stocks.reduce(
      (total, stock) => total + stock.investment,
      0
    );

    if (calculatedSectorInvestment !== sector.sectorInvestment) {
      addError(
        `${sector.sector}: sector total mismatch. ` +
          `Expected ${calculatedSectorInvestment}, got ${sector.sectorInvestment}`
      );
    }
  }
}

function validatePortfolioTotal(): void {
  const calculatedTotalInvestment = portfolioData.activeHoldings.reduce(
    (portfolioTotal, sector) => portfolioTotal + sector.sectorInvestment,
    0
  );

  assertEqual(
    "Total active portfolio investment",
    calculatedTotalInvestment,
    EXPECTED_TOTAL_INVESTMENT
  );
}

function validateCounts(): void {
  const activeHoldingsCount = portfolioData.activeHoldings.reduce(
    (count, sector) => count + sector.stocks.length,
    0
  );

  const excludedRowsCount = portfolioData.excludedRows.length;

  assertEqual(
    "Active holdings count",
    activeHoldingsCount,
    EXPECTED_ACTIVE_HOLDINGS_COUNT
  );

  assertEqual(
    "Excluded rows count",
    excludedRowsCount,
    EXPECTED_EXCLUDED_ROWS_COUNT
  );
}

function validatePortfolioPercentages(): void {
  const totalInvestment = portfolioData.activeHoldings.reduce(
    (portfolioTotal, sector) => portfolioTotal + sector.sectorInvestment,
    0
  );

  const percentageSum = portfolioData.activeHoldings
    .flatMap((sector) => sector.stocks)
    .reduce((total, stock) => {
      return total + (stock.investment / totalInvestment) * 100;
    }, 0);

  const roundedPercentageSum = Math.round(percentageSum * 100) / 100;

  if (Math.abs(roundedPercentageSum - 100) > 0.01) {
    addError(
      `Portfolio percentage sum should be approximately 100, got ${roundedPercentageSum}`
    );
  }
}

function validateRequiredFields(): void {
  for (const sector of portfolioData.activeHoldings) {
    for (const stock of sector.stocks) {
      if (!stock.name) {
        addError(`Stock with id ${stock.id} is missing name`);
      }

      if (stock.purchasePrice <= 0) {
        addError(`${stock.name}: purchase price must be greater than 0`);
      }

      if (stock.quantity <= 0) {
        addError(`${stock.name}: quantity must be greater than 0`);
      }

      if (!stock.yahooSymbol && !stock.nseSymbol && !stock.bseCode) {
        addError(`${stock.name}: missing Yahoo/NSE/BSE symbol information`);
      }
    }
  }
}

function runValidation(): void {
  console.log("Validating portfolio data...");

  validateStockInvestments();
  validateSectorTotals();
  validatePortfolioTotal();
  validateCounts();
  validatePortfolioPercentages();
  validateRequiredFields();

  if (errors.length > 0) {
    console.error("\nPortfolio data validation failed:\n");

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exit(1);
  }

  console.log("\nPortfolio data validation passed.");
  console.log(`Active holdings: ${EXPECTED_ACTIVE_HOLDINGS_COUNT}`);
  console.log(`Excluded rows: ${EXPECTED_EXCLUDED_ROWS_COUNT}`);
  console.log(`Total investment: ₹${EXPECTED_TOTAL_INVESTMENT.toLocaleString("en-IN")}`);
}

runValidation();
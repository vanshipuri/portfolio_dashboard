import type { Sector } from "../types/portfolio.types";

function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportPortfolioToCsv(sectors: Sector[]): void {
  const headers = [
    "Sector",
    "Stock Name",
    "Purchase Price",
    "Quantity",
    "Investment",
    "Portfolio %",
    "NSE/BSE",
    "CMP",
    "Present Value",
    "Gain/Loss",
    "Gain/Loss %",
    "P/E Ratio",
    "Latest Earnings / EPS",
    "Price Source",
    "Fundamentals Source"
  ];

  const rows: Array<Array<string | number | null | undefined>> = [];

  for (const sector of sectors) {
    rows.push([
      sector.sector,
      "SECTOR TOTAL",
      null,
      null,
      sector.sectorInvestment,
      sector.sectorPortfolioPercentage,
      null,
      null,
      sector.totalPresentValue,
      sector.totalGainLoss,
      sector.totalGainLossPercent,
      null,
      null,
      null,
      null
    ]);

    for (const stock of sector.stocks) {
      rows.push([
        sector.sector,
        stock.name,
        stock.purchasePrice,
        stock.quantity,
        stock.investment,
        stock.portfolioPercentage,
        stock.sourceNseBseCode,
        stock.cmp,
        stock.presentValue,
        stock.gainLoss,
        stock.gainLossPercent,
        stock.peRatio,
        stock.latestEarnings,
        stock.priceSource,
        stock.fundamentalsSource
      ]);
    }
  }

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `portfolio-dashboard-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
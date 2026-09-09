import React from "react";
import type { Sector } from "../../types/portfolio.types";
import SectorRow from "./SectorRow";
import StockRow from "./StockRow";

interface PortfolioTableProps {
  sectors: Sector[];
}

const columns = [
  "Particulars",
  "Purchase Price",
  "Qty",
  "Investment",
  "Portfolio %",
  "NSE/BSE",
  "CMP",
  "Present Value",
  "Gain/Loss",
  "Gain/Loss %",
  "P/E Ratio",
  "Latest Earnings / EPS"
];

export default function PortfolioTable({ sectors }: PortfolioTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sectors.map((sector) => (
              <React.Fragment key={sector.sector}>
                <SectorRow sector={sector} />

                {sector.stocks.map((stock) => (
                  <StockRow key={stock.id} stock={stock} />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

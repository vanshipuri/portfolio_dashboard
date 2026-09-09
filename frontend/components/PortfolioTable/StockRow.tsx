import type { Stock } from "../../types/portfolio.types";
import {
  formatCurrency,
  formatNumber,
  formatPercent
} from "../../utils/formatters";

interface StockRowProps {
  stock: Stock;
}

export default function StockRow({ stock }: StockRowProps) {
  const isGain = (stock.gainLoss ?? 0) >= 0;

  const gainLossClass =
    stock.gainLoss === null
      ? "text-slate-400"
      : isGain
        ? "text-green-400"
        : "text-red-400";

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-800/40">
      <td className="px-4 py-3 font-medium text-white">{stock.name}</td>

      <td className="px-4 py-3 text-slate-300">
        {formatCurrency(stock.purchasePrice)}
      </td>

      <td className="px-4 py-3 text-slate-300">
        {stock.quantity.toLocaleString("en-IN")}
      </td>

      <td className="px-4 py-3 text-slate-300">
        {formatCurrency(stock.investment)}
      </td>

      <td className="px-4 py-3 text-slate-300">
        {formatPercent(stock.portfolioPercentage)}
      </td>

      <td className="px-4 py-3 text-blue-400">
        {stock.sourceNseBseCode}
      </td>

      <td className="px-4 py-3">
        {stock.priceStatus === "success" ? (
          <div>
            <span className="text-white">
              {formatCurrency(stock.cmp)}
            </span>
            <br />
            <SourceBadge label={stock.priceSource} />
          </div>
        ) : (
          <div>
            <span title={stock.priceError ?? ""} className="text-yellow-400">
              N/A
            </span>
            <br />
            <SourceBadge label="unavailable" />
          </div>
        )}
      </td>

      <td className="px-4 py-3 text-slate-300">
        {formatCurrency(stock.presentValue)}
      </td>

      <td className={`px-4 py-3 font-semibold ${gainLossClass}`}>
        {formatCurrency(stock.gainLoss)}
      </td>

      <td className={`px-4 py-3 font-semibold ${gainLossClass}`}>
        {formatPercent(stock.gainLossPercent)}
      </td>

      <td className="px-4 py-3 text-slate-300">
        <div>
          {formatNumber(stock.peRatio)}
          <br />
          <SourceBadge label={stock.fundamentalsSource} />
        </div>
      </td>

      <td className="px-4 py-3 text-slate-300">
        {formatNumber(stock.latestEarnings)}
      </td>
    </tr>
  );
}

function SourceBadge({ label }: { label: string }) {
  const colorClass =
    label === "cache"
      ? "bg-blue-500/10 text-blue-300"
      : label === "unavailable"
        ? "bg-yellow-500/10 text-yellow-300"
        : label === "static-assignment-data"
          ? "bg-purple-500/10 text-purple-300"
          : "bg-emerald-500/10 text-emerald-300";

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
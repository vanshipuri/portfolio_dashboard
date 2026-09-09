import type { Sector } from "../../types/portfolio.types";
import { formatCurrency, formatPercent } from "../../utils/formatters";

interface SectorRowProps {
  sector: Sector;
}

export default function SectorRow({ sector }: SectorRowProps) {
  const isGain = (sector.totalGainLoss ?? 0) >= 0;

  return (
    <tr className="bg-slate-800/90 text-white">
      <td className="px-4 py-3 font-bold" colSpan={3}>
        {sector.sector}
      </td>

      <td className="px-4 py-3 font-semibold">
        {formatCurrency(sector.sectorInvestment)}
      </td>

      <td className="px-4 py-3">
        {formatPercent(sector.sectorPortfolioPercentage)}
      </td>

      <td className="px-4 py-3">Sector Total</td>

      <td className="px-4 py-3">—</td>

      <td className="px-4 py-3 font-semibold">
        {formatCurrency(sector.totalPresentValue)}
      </td>

      <td
        className={`px-4 py-3 font-semibold ${
          isGain ? "text-green-400" : "text-red-400"
        }`}
      >
        {formatCurrency(sector.totalGainLoss)}
      </td>

      <td
        className={`px-4 py-3 font-semibold ${
          isGain ? "text-green-400" : "text-red-400"
        }`}
      >
        {formatPercent(sector.totalGainLossPercent)}
      </td>

      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">—</td>
    </tr>
  );
}
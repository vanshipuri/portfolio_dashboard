import { formatCurrency, formatPercent } from "../../utils/formatters";

interface DashboardHeaderProps {
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainLoss: number | null;
  totalGainLossPercent: number | null;
}

export default function DashboardHeader({
  totalInvestment,
  totalPresentValue,
  totalGainLoss,
  totalGainLossPercent
}: DashboardHeaderProps) {
  const isGain = (totalGainLoss ?? 0) >= 0;

  return (
    <header className="mb-6">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
          Dynamic Portfolio Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Portfolio Overview
        </h1>
        <p className="mt-2 text-slate-400">
          Real-time CMP tracking with sector-wise performance summary.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Total Investment"
          value={formatCurrency(totalInvestment)}
        />

        <SummaryCard
          label="Present Value"
          value={formatCurrency(totalPresentValue)}
        />

        <SummaryCard
          label="Total Gain/Loss"
          value={formatCurrency(totalGainLoss)}
          tone={isGain ? "positive" : "negative"}
        />

        <SummaryCard
          label="Gain/Loss %"
          value={formatPercent(totalGainLossPercent)}
          tone={isGain ? "positive" : "negative"}
        />
      </div>
    </header>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}

function SummaryCard({ label, value, tone = "neutral" }: SummaryCardProps) {
  const toneClass =
    tone === "positive"
      ? "text-green-400"
      : tone === "negative"
        ? "text-red-400"
        : "text-white";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
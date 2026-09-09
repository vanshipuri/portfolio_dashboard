"use client";

import DashboardHeader from "../components/Header/DashboardHeader";
import PortfolioTable from "../components/PortfolioTable";
import ErrorBanner from "../components/UI/ErrorBanner";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import RefreshTimer from "../components/UI/RefreshTimer";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Home() {
  const {
    portfolio,
    meta,
    isLoading,
    error,
    countdown,
    refetch
  } = usePortfolioData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <div className="mx-auto max-w-7xl">
        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {portfolio ? (
          <>
            <DashboardHeader
              totalInvestment={portfolio.totalInvestment}
              totalPresentValue={portfolio.totalPresentValue}
              totalGainLoss={portfolio.totalGainLoss}
              totalGainLossPercent={portfolio.totalGainLossPercent}
            />

            <RefreshTimer
              countdown={countdown}
              lastUpdated={meta?.lastUpdated ?? null}
              onManualRefresh={refetch}
            />

            <PortfolioTable sectors={portfolio.sectors} />

            <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
              <p>
                Price source:{" "}
                <span className="text-slate-200">
                  {meta?.priceSource ?? "Unavailable"}
                </span>
              </p>
              <p>
                Fundamentals source:{" "}
                <span className="text-slate-200">
                  {meta?.fundamentalsSource ?? "Unavailable"}
                </span>
              </p>
              <p>
                Active holdings:{" "}
                <span className="text-slate-200">
                  {meta?.activeHoldingsCount ?? 0}
                </span>
              </p>
              <p>
                Excluded rows:{" "}
                <span className="text-slate-200">
                  {meta?.excludedRowsCount ?? 0}
                </span>
              </p>
            </section>
          </>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
            No portfolio data available.
          </div>
        )}
      </div>
    </main>
  );
}
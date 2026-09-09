"use client";

import { useMemo, useState } from "react";
import DashboardHeader from "../components/Header/DashboardHeader";
import PortfolioTable from "../components/PortfolioTable";
import ErrorBanner from "../components/UI/ErrorBanner";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import RefreshTimer from "../components/UI/RefreshTimer";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    portfolio,
    meta,
    isLoading,
    error,
    countdown,
    refetch
  } = usePortfolioData();

  const filteredSectors = useMemo(() => {
    if (!portfolio) {
      return [];
    }

    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return portfolio.sectors;
    }

    return portfolio.sectors
      .map((sector) => {
        const sectorMatches = sector.sector.toLowerCase().includes(term);

        const filteredStocks = sectorMatches
          ? sector.stocks
          : sector.stocks.filter((stock) => {
              return (
                stock.name.toLowerCase().includes(term) ||
                stock.sourceNseBseCode.toLowerCase().includes(term) ||
                stock.exchange.toLowerCase().includes(term)
              );
            });

        return {
          ...sector,
          stocks: filteredStocks
        };
      })
      .filter((sector) => sector.stocks.length > 0);
  }, [portfolio, searchTerm]);

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

            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Search stocks
              </label>

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by stock name, NSE/BSE code, or exchange..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              {searchTerm.trim() && (
                <p className="mt-2 text-sm text-slate-400">
                  Showing results for{" "}
                  <span className="font-medium text-slate-200">
                    "{searchTerm}"
                  </span>
                </p>
              )}
            </div>

            {filteredSectors.length > 0 ? (
              <PortfolioTable sectors={filteredSectors} />
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
                No stocks found for "{searchTerm}".
              </div>
            )}

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
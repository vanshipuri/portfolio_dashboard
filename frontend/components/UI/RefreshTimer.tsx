import { formatDateTime } from "../../utils/formatters";

interface RefreshTimerProps {
  countdown: number;
  lastUpdated: string | null;
  onManualRefresh: () => void;
}

export default function RefreshTimer({
  countdown,
  lastUpdated,
  onManualRefresh
}: RefreshTimerProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p>
          Last updated:{" "}
          <span className="text-white">{formatDateTime(lastUpdated)}</span>
        </p>
        <p>
          Next refresh in{" "}
          <span className="font-semibold text-blue-400">{countdown}s</span>
        </p>
      </div>

      <button
        onClick={onManualRefresh}
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Refresh now
      </button>
    </div>
  );
}
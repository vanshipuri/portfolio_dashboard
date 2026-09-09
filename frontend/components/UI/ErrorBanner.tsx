interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Unable to load portfolio</p>
          <p className="text-sm text-red-200/80">{message}</p>
        </div>

        <button
          onClick={onRetry}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
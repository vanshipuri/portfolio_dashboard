export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <p className="text-slate-300">Loading portfolio data...</p>
      </div>
    </div>
  );
}
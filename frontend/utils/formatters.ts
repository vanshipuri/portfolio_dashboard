export function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;
}

export function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium"
  });
}
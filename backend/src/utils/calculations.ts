export function calculateInvestment(
  purchasePrice: number,
  quantity: number
): number {
  return purchasePrice * quantity;
}

export function calculatePortfolioPercentage(
  investment: number,
  totalInvestment: number
): number {
  if (totalInvestment === 0) {
    return 0;
  }

  return (investment / totalInvestment) * 100;
}

export function calculatePresentValue(
  cmp: number | null,
  quantity: number
): number | null {
  if (cmp === null) {
    return null;
  }

  return cmp * quantity;
}

export function calculateGainLoss(
  presentValue: number | null,
  investment: number
): number | null {
  if (presentValue === null) {
    return null;
  }

  return presentValue - investment;
}

export function calculateGainLossPercent(
  gainLoss: number | null,
  investment: number
): number | null {
  if (gainLoss === null || investment === 0) {
    return null;
  }

  return (gainLoss / investment) * 100;
}

export function sumNumbers(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
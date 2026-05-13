// reSpace Affordability Calculator — configuration constants and metros.

export const AFFORDABILITY_CONFIG = {
  frontEndRatio: 0.28,
  backEndRatio: 0.36,
  mortgageRate: 0.0675,
  loanTermMonths: 360,
  defaultCoOwnerGroupSize: 4,
  propertyTaxRate: 0.01,
  insuranceRate: 0.005,
  maintenanceReserveRate: 0.01,
};

export const METROS = [
  { value: "Seattle, WA", median: 875000 },
  { value: "Bellevue, WA", median: 1450000 },
  { value: "Tacoma, WA", median: 525000 },
  { value: "Olympia, WA", median: 485000 },
  { value: "Spokane, WA", median: 410000 },
] as const;

export type MetroValue = (typeof METROS)[number]["value"];

export function medianFor(metro: string): number {
  const m = METROS.find((x) => x.value === metro);
  return m?.median ?? 0;
}

export const GHL_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_RESPACE_AFFORDABILITY_WEBHOOK ??
  "https://services.leadconnectorhq.com/hooks/SWAP_IN_RESPACE_AFFORDABILITY_WEBHOOK";
export const HOLD_YOUR_SPACE_URL =
  process.env.NEXT_PUBLIC_RESPACE_HOLD_YOUR_SPACE_URL ??
  "https://respace.co/hold-your-space";
export const BUYER_POOL_URL =
  process.env.NEXT_PUBLIC_RESPACE_BUYER_POOL_URL ??
  "https://respace.co/buyer-pool";

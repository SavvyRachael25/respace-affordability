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
  process.env.NEXT_PUBLIC_RESPACE_AFFORDABILITY_WEBHOOK ?? "";
export const GHL_LEAD_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_RESPACE_LEAD_WEBHOOK ?? "";
export const HOLD_YOUR_SPACE_URL =
  process.env.NEXT_PUBLIC_RESPACE_HOLD_YOUR_SPACE_URL ??
  "https://respace.co/hold-your-space";
export const BUYER_POOL_URL =
  process.env.NEXT_PUBLIC_RESPACE_BUYER_POOL_URL ??
  "https://respace.co/buyer-pool";

// Brand tokens — sourced from brand.respace.co v1.5 (matches the live reSpace site).
export const RESPACE_THEME = {
  navy: "#1A1A2E",
  navySoft: "#232838",
  coral: "#E8604C",
  coralHover: "#d4503f",
  sand: "#F5EFE6",
  sage: "#7C9A7E",
  white: "#FFFFFF",
  body: "#444444",
  textOnDark: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.7)",
  textSubtle: "rgba(255,255,255,0.5)",
  borderOnDark: "rgba(255,255,255,0.10)",
  borderOnLight: "rgba(26,26,46,0.10)",
  fontDisplay: '"Clash Display", "Inter", system-ui, sans-serif',
  fontBody: '"DM Sans", system-ui, -apple-system, sans-serif',
};

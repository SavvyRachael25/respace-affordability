import propertiesData from "@/data/properties.json";

export type SuiteSummary = {
  suiteId: string;
  label?: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  sharePrice: number;
  status: "available" | "reserved" | "sold";
};

export function suiteDisplayName(s: SuiteSummary): string {
  return s.label ?? s.suiteId;
}

// Compute affordability fit per suite given the buyer's max share price
// (which equals their solo max home value, since one share = one suite).
export function fitSummary(
  suites: SuiteSummary[],
  shareCeiling: number
): {
  withinReach: SuiteSummary[];
  stretch: SuiteSummary[];
  topMatch?: SuiteSummary;
} {
  const available = suites.filter((s) => s.status === "available");
  const withinReach = available
    .filter((s) => s.sharePrice <= shareCeiling)
    .slice()
    .sort((a, b) => b.sharePrice - a.sharePrice);
  const stretch = available
    .filter((s) => s.sharePrice > shareCeiling)
    .slice()
    .sort((a, b) => a.sharePrice - b.sharePrice);
  // Top match = highest-priced suite still within reach (best they can afford),
  // falls back to the lowest stretch if nothing fits.
  const topMatch = withinReach[0] ?? stretch[stretch.length - 1];
  return { withinReach, stretch, topMatch };
}

export type PropertyStatus =
  | "live"
  | "permits-pending"
  | "coming-soon"
  | "sold-out";

export type ReSpaceProperty = {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  metro: string;
  totalPrice: number;
  shareCount: number;
  sharePriceMin: number;
  sharePriceMax: number;
  shareCountAvailable: number;
  bedroomsTotal: number;
  suitesAvailable: SuiteSummary[];
  heroImage?: string;
  gallery?: string[];
  description: string;
  status: PropertyStatus;
  expectedMoveIn?: string;
  detailUrl: string;
};

const ALL_PROPERTIES = propertiesData as ReSpaceProperty[];

const STATUS_ORDER: Record<PropertyStatus, number> = {
  live: 0,
  "permits-pending": 1,
  "coming-soon": 2,
  "sold-out": 3,
};

export function listProperties(
  metro: string,
  shareCeiling?: number
): ReSpaceProperty[] {
  return ALL_PROPERTIES
    .filter((p) => p.metro === metro)
    .filter((p) => p.status === "live" || p.status === "permits-pending")
    .filter((p) =>
      shareCeiling == null ? true : p.sharePriceMin <= shareCeiling
    )
    .slice()
    .sort((a, b) => {
      const s = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (s !== 0) return s;
      return a.sharePriceMin - b.sharePriceMin;
    });
}

export function getProperty(slug: string): ReSpaceProperty | undefined {
  return ALL_PROPERTIES.find((p) => p.slug === slug);
}

import propertiesData from "@/data/properties.json";

export type SuiteSummary = {
  suiteId: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  sharePrice: number;
  status: "available" | "reserved" | "sold";
};

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

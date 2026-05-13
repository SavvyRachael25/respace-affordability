"use client";

import { RESPACE_THEME } from "@/lib/affordability/config";
import { fmtUSD } from "@/lib/affordability/calculate";
import {
  fitSummary,
  suiteDisplayName,
  type ReSpaceProperty,
} from "@/lib/respace/properties";

const T = RESPACE_THEME;

export function PropertyCard({
  property,
  shareCeiling,
  onSelect,
}: {
  property: ReSpaceProperty;
  shareCeiling: number;
  onSelect: (slug: string) => void;
}) {
  const fit = fitSummary(property.suitesAvailable, shareCeiling);
  const totalAvailable = fit.withinReach.length + fit.stretch.length;
  const fitCount = fit.withinReach.length;
  const top = fit.topMatch;
  const statusLabel =
    property.status === "live"
      ? "Live"
      : property.status === "permits-pending"
      ? "Permits pending"
      : property.status === "coming-soon"
      ? "Coming soon"
      : "Sold out";
  const statusColor =
    property.status === "live" ? T.coral : "rgba(255,255,255,0.55)";

  return (
    <button
      type="button"
      onClick={() => onSelect(property.slug)}
      style={{
        textAlign: "left",
        background: T.navySoft,
        border: `1px solid ${T.borderOnDark}`,
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        fontFamily: T.fontBody,
        color: T.textOnDark,
        transition: "transform 200ms ease, box-shadow 200ms ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow =
          "0 12px 36px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 3",
          background: property.heroImage
            ? `url(${property.heroImage}) center/cover`
            : "linear-gradient(135deg,#e0d8cc,#ccc4b8)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: 16,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: statusColor,
            background: "rgba(26,26,46,0.7)",
            padding: "6px 12px",
            borderRadius: 2,
          }}
        >
          {statusLabel}
        </span>
      </div>

      <div style={{ padding: 24 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: T.coral,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {property.neighborhood}
        </p>
        <h4
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 26,
            fontWeight: 600,
            color: T.textOnDark,
            letterSpacing: "-0.01em",
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          {property.name}
        </h4>
        <p
          style={{
            fontSize: 14,
            color: T.textMuted,
            lineHeight: 1.55,
            marginBottom: 20,
          }}
        >
          {property.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            paddingTop: 16,
            borderTop: `1px solid ${T.borderOnDark}`,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: T.textSubtle,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Share from
            </p>
            <p
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 700,
                color: T.coral,
                lineHeight: 1,
              }}
            >
              {fmtUSD(property.sharePriceMin)}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: T.textSubtle,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Full property
            </p>
            <p
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 600,
                color: T.textOnDark,
                lineHeight: 1,
              }}
            >
              {fmtUSD(property.totalPrice)}
            </p>
          </div>
        </div>

        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: T.textMuted,
            lineHeight: 1.5,
          }}
        >
          {property.bedroomsTotal} bedrooms across {property.shareCount}{" "}
          private suites · {property.shareCountAvailable} shares open
        </p>

        {/* The "this could be yours" moment — fit summary against buyer's max. */}
        {totalAvailable > 0 ? (
          <div
            style={{
              marginTop: 16,
              padding: "14px 16px",
              borderRadius: 4,
              background:
                fitCount > 0
                  ? "rgba(232,96,76,0.10)"
                  : "rgba(255,255,255,0.04)",
              border: `1px solid ${
                fitCount > 0 ? "rgba(232,96,76,0.35)" : T.borderOnDark
              }`,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                color: fitCount > 0 ? T.coral : T.textSubtle,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {fitCount > 0
                ? `${fitCount} of ${totalAvailable} within your reach`
                : "Just above your range"}
            </p>
            {top ? (
              <p
                style={{
                  fontSize: 14,
                  color: T.textOnDark,
                  lineHeight: 1.4,
                }}
              >
                {fitCount > 0 ? "Top match: " : "Closest: "}
                <strong style={{ color: T.textOnDark, fontWeight: 700 }}>
                  {suiteDisplayName(top)}
                </strong>{" "}
                <span style={{ color: T.coral, fontWeight: 700 }}>
                  {fmtUSD(top.sharePrice)}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 700,
            color: T.coral,
            letterSpacing: "0.02em",
          }}
        >
          Pick your suite <span aria-hidden>{"→"}</span>
        </div>
      </div>
    </button>
  );
}

"use client";

import { useMemo } from "react";
import { RESPACE_THEME } from "@/lib/affordability/config";
import { listProperties, type ReSpaceProperty } from "@/lib/respace/properties";
import { PropertyCard } from "./PropertyCard";

const T = RESPACE_THEME;

export function PropertyGallery({
  metro,
  shareCeiling,
  onSelect,
  onNotifyClick,
}: {
  metro: string;
  shareCeiling: number;
  onSelect: (slug: string) => void;
  onNotifyClick?: () => void;
}) {
  const properties: ReSpaceProperty[] = useMemo(
    () => listProperties(metro, shareCeiling),
    [metro, shareCeiling]
  );

  return (
    <section style={{ padding: "80px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontFamily: T.fontBody,
              fontSize: 13,
              letterSpacing: "0.12em",
              color: T.coral,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Properties Available
          </p>
          <h3
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 600,
              color: T.textOnDark,
              letterSpacing: "-0.015em",
              lineHeight: 1.05,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            Properties you could be a co-owner of in {metro}.
          </h3>
        </div>

        {properties.length === 0 ? (
          <NoMatches metro={metro} onNotifyClick={onNotifyClick} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NoMatches({
  metro,
  onNotifyClick,
}: {
  metro: string;
  onNotifyClick?: () => void;
}) {
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "0 auto",
        background: T.navySoft,
        border: `1px solid ${T.borderOnDark}`,
        borderRadius: 4,
        padding: 40,
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 22,
          fontWeight: 600,
          color: T.textOnDark,
          marginBottom: 12,
          lineHeight: 1.25,
        }}
      >
        We don&apos;t have a property matching that range in {metro} right now.
      </p>
      <p
        style={{
          fontSize: 15,
          color: T.textMuted,
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        Want us to notify you when one opens up? Drop your email and we&apos;ll
        reach out the moment a new property lands.
      </p>
      {onNotifyClick ? (
        <button
          type="button"
          onClick={onNotifyClick}
          style={{
            padding: "14px 28px",
            background: T.coral,
            color: T.white,
            fontFamily: T.fontBody,
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
          Notify Me
        </button>
      ) : null}
    </div>
  );
}

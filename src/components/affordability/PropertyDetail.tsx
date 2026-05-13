"use client";

import { useState } from "react";
import { RESPACE_THEME } from "@/lib/affordability/config";
import { fmtUSD } from "@/lib/affordability/calculate";
import type { ReSpaceProperty, SuiteSummary } from "@/lib/respace/properties";
import type { AffordabilityResult } from "@/lib/affordability/calculate";
import { LeadCaptureForm } from "./LeadCaptureForm";

const T = RESPACE_THEME;

export function PropertyDetail({
  property,
  affordability,
  metro,
  income,
  debts,
  downPayment,
  initialEmail,
  utm,
  onBack,
  onSubmitted,
}: {
  property: ReSpaceProperty;
  affordability: AffordabilityResult;
  metro: string;
  income: number;
  debts: number;
  downPayment: number;
  initialEmail: string;
  utm: { campaign?: string; source?: string };
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const [selectedSuite, setSelectedSuite] = useState<string | undefined>(
    undefined
  );

  const statusLabel =
    property.status === "live"
      ? "Live"
      : property.status === "permits-pending"
      ? "Permits pending"
      : property.status === "coming-soon"
      ? "Coming soon"
      : "Sold out";

  return (
    <section style={{ padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: T.coral,
            fontFamily: T.fontBody,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            padding: 0,
            marginBottom: 24,
            letterSpacing: "0.02em",
          }}
        >
          {"←"} Back to properties
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="prop-detail-grid"
        >
          {/* Left: hero + property info */}
          <div>
            <div
              style={{
                aspectRatio: "4 / 3",
                background: property.heroImage
                  ? `url(${property.heroImage}) center/cover`
                  : "linear-gradient(135deg,#e0d8cc,#ccc4b8)",
                borderRadius: 4,
                marginBottom: 24,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color:
                    property.status === "live"
                      ? T.coral
                      : "rgba(255,255,255,0.55)",
                  background: "rgba(26,26,46,0.7)",
                  padding: "6px 12px",
                  borderRadius: 2,
                }}
              >
                {statusLabel}
              </span>
            </div>

            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.15em",
                color: T.coral,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {property.neighborhood}
            </p>
            <h2
              style={{
                fontFamily: T.fontDisplay,
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 700,
                color: T.textOnDark,
                letterSpacing: "-0.015em",
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              {property.name}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: T.textMuted,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              {property.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 20,
                padding: "24px 0",
                borderTop: `1px solid ${T.borderOnDark}`,
                borderBottom: `1px solid ${T.borderOnDark}`,
              }}
            >
              <Stat label="Full property" value={fmtUSD(property.totalPrice)} />
              <Stat
                label="Share from"
                value={fmtUSD(property.sharePriceMin)}
                accent
              />
              <Stat
                label="Suites open"
                value={`${property.shareCountAvailable} of ${property.shareCount}`}
              />
            </div>

            {property.expectedMoveIn ? (
              <p
                style={{
                  marginTop: 18,
                  fontSize: 14,
                  color: T.textMuted,
                }}
              >
                Expected move-in:{" "}
                <strong style={{ color: T.textOnDark }}>
                  {property.expectedMoveIn}
                </strong>
              </p>
            ) : null}

            <h4
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 600,
                color: T.textOnDark,
                marginTop: 36,
                marginBottom: 16,
              }}
            >
              Suites available
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {property.suitesAvailable.map((s) => (
                <SuiteCard
                  key={s.suiteId}
                  suite={s}
                  selected={selectedSuite === s.suiteId}
                  onSelect={() =>
                    setSelectedSuite(
                      selectedSuite === s.suiteId ? undefined : s.suiteId
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* Right: lead capture form */}
          <div
            style={{
              position: "sticky",
              top: 24,
            }}
          >
            <LeadCaptureForm
              property={property}
              initialEmail={initialEmail}
              affordability={affordability}
              metro={metro}
              income={income}
              debts={debts}
              downPayment={downPayment}
              suiteId={selectedSuite}
              utm={utm}
              onSubmitted={onSubmitted}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .prop-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          color: T.textSubtle,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 26,
          fontWeight: 700,
          color: accent ? T.coral : T.textOnDark,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SuiteCard({
  suite,
  selected,
  onSelect,
}: {
  suite: SuiteSummary;
  selected: boolean;
  onSelect: () => void;
}) {
  const disabled = suite.status !== "available";
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      style={{
        textAlign: "left",
        background: selected ? "rgba(232,96,76,0.10)" : T.navySoft,
        border: `1px solid ${
          selected ? T.coral : T.borderOnDark
        }`,
        borderRadius: 4,
        padding: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: T.fontBody,
        color: T.textOnDark,
        transition: "border 200ms ease, background 200ms ease",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: T.coral,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {suite.bedrooms} bd · {suite.bathrooms} ba
      </p>
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 20,
          fontWeight: 700,
          color: T.coral,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {fmtUSD(suite.sharePrice)}
      </p>
      <p
        style={{
          fontSize: 12,
          color: T.textMuted,
        }}
      >
        {suite.squareFeet} sq ft
      </p>
      {disabled ? (
        <p
          style={{
            marginTop: 6,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: T.textSubtle,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {suite.status}
        </p>
      ) : null}
    </button>
  );
}

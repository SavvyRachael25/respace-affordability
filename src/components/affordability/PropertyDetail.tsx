"use client";

import { useMemo, useState } from "react";
import { RESPACE_THEME } from "@/lib/affordability/config";
import { fmtUSD } from "@/lib/affordability/calculate";
import {
  fitSummary,
  suiteDisplayName,
  type ReSpaceProperty,
  type SuiteSummary,
} from "@/lib/respace/properties";
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
  selectedSuiteId,
  onSelectSuite,
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
  selectedSuiteId?: string;
  onSelectSuite: (suiteId: string | undefined) => void;
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const shareCeiling = affordability.solo.maxHomeValue;

  // Gallery: first try property.gallery, fall back to hero alone.
  const images = useMemo<string[]>(() => {
    if (property.gallery && property.gallery.length > 0) return property.gallery;
    if (property.heroImage) return [property.heroImage];
    return [];
  }, [property.gallery, property.heroImage]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = images[activeImageIdx];

  // Sort suites: within-reach descending by price (best match first),
  // then stretch ascending by price (closest stretch first). Sold/reserved
  // end up at the bottom via the status filter inside fitSummary; we add
  // them back separately so the list stays complete.
  const sortedSuites: SuiteSummary[] = useMemo(() => {
    const fit = fitSummary(property.suitesAvailable, shareCeiling);
    const sold = property.suitesAvailable.filter(
      (s) => s.status !== "available"
    );
    return [...fit.withinReach, ...fit.stretch, ...sold];
  }, [property.suitesAvailable, shareCeiling]);

  const selectedSuite = useMemo(
    () =>
      selectedSuiteId
        ? property.suitesAvailable.find((s) => s.suiteId === selectedSuiteId)
        : undefined,
    [selectedSuiteId, property.suitesAvailable]
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
          className="prop-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left: hero + property info + suite picker */}
          <div>
            <div
              style={{
                aspectRatio: "4 / 3",
                background: activeImage
                  ? `url(${activeImage}) center/cover`
                  : "linear-gradient(135deg,#e0d8cc,#ccc4b8)",
                borderRadius: 4,
                marginBottom: images.length > 1 ? 12 : 24,
                position: "relative",
                transition: "background 300ms ease",
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

            {/* Thumbnail strip — only render when there's more than one image. */}
            {images.length > 1 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${images.length}, 1fr)`,
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImageIdx(i)}
                    aria-label={`View image ${i + 1} of ${images.length}`}
                    aria-pressed={i === activeImageIdx}
                    style={{
                      aspectRatio: "4 / 3",
                      background: `url(${src}) center/cover`,
                      borderRadius: 2,
                      border: `2px solid ${
                        i === activeImageIdx ? T.coral : "transparent"
                      }`,
                      padding: 0,
                      cursor: "pointer",
                      opacity: i === activeImageIdx ? 1 : 0.7,
                      transition: "opacity 200ms ease, border 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity =
                        i === activeImageIdx ? "1" : "0.7";
                    }}
                  />
                ))}
              </div>
            ) : null}

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

            {/* Suite picker — the picture-yourself moment. */}
            <div
              style={{
                marginTop: 36,
                marginBottom: 16,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <h4
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 24,
                  fontWeight: 700,
                  color: T.textOnDark,
                  letterSpacing: "-0.01em",
                }}
              >
                Pick the suite you want.
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: T.textMuted,
                }}
              >
                Coral suites are within your reach.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {sortedSuites.map((s) => (
                <SuiteCard
                  key={s.suiteId}
                  suite={s}
                  shareCeiling={shareCeiling}
                  selected={selectedSuiteId === s.suiteId}
                  onSelect={() =>
                    onSelectSuite(
                      selectedSuiteId === s.suiteId ? undefined : s.suiteId
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
              suiteId={selectedSuite?.suiteId}
              suiteLabel={
                selectedSuite ? suiteDisplayName(selectedSuite) : undefined
              }
              suiteSharePrice={selectedSuite?.sharePrice}
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
  shareCeiling,
  selected,
  onSelect,
}: {
  suite: SuiteSummary;
  shareCeiling: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const disabled = suite.status !== "available";
  const withinReach = !disabled && suite.sharePrice <= shareCeiling;
  const stretch = !disabled && !withinReach;

  // Borders + backgrounds tell three stories at a glance:
  //   selected  → bold coral fill + coral border
  //   withinReach → soft coral wash, coral border
  //   stretch   → muted navySoft, dim border
  let bg = T.navySoft;
  let border = T.borderOnDark;
  if (selected) {
    bg = "rgba(232,96,76,0.18)";
    border = T.coral;
  } else if (withinReach) {
    bg = "rgba(232,96,76,0.06)";
    border = "rgba(232,96,76,0.35)";
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      aria-pressed={selected}
      style={{
        textAlign: "left",
        background: bg,
        border: `${selected ? "2px" : "1px"} solid ${border}`,
        borderRadius: 4,
        padding: selected ? 15 : 16,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: T.fontBody,
        color: T.textOnDark,
        position: "relative",
        transition:
          "border 200ms ease, background 200ms ease, transform 150ms ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !selected)
          e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Picked badge */}
      {selected ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: T.white,
            background: T.coral,
            padding: "4px 8px",
            borderRadius: 2,
          }}
        >
          Picked
        </span>
      ) : null}

      {/* Name first — this is the picture-yourself anchor */}
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 18,
          fontWeight: 700,
          color: T.textOnDark,
          letterSpacing: "-0.005em",
          marginBottom: 8,
          lineHeight: 1.15,
        }}
      >
        {suiteDisplayName(suite)}
      </p>

      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 22,
          fontWeight: 700,
          color: T.coral,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {fmtUSD(suite.sharePrice)}
      </p>

      <p
        style={{
          fontSize: 12,
          color: T.textMuted,
          marginBottom: 8,
        }}
      >
        {suite.bedrooms} bd · {suite.bathrooms} ba · {suite.squareFeet} sq ft
      </p>

      {/* Fit indicator */}
      {!disabled ? (
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: withinReach ? T.coral : T.textSubtle,
          }}
        >
          {withinReach ? "Within your reach" : "Stretch"}
        </p>
      ) : null}

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

      {/* Reserve room for hover */}
      {stretch ? null : null}
    </button>
  );
}

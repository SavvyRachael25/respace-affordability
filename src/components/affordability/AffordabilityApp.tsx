"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AffordabilityInputs,
  AffordabilityResult,
  calculateAffordability,
  fmtUSD,
} from "@/lib/affordability/calculate";
import {
  METROS,
  medianFor,
  HOLD_YOUR_SPACE_URL,
  BUYER_POOL_URL,
  RESPACE_THEME,
} from "@/lib/affordability/config";
import { getProperty } from "@/lib/respace/properties";
import { PropertyGallery } from "./PropertyGallery";
import { PropertyDetail } from "./PropertyDetail";

const T = RESPACE_THEME;

const STRIPE_DISCLAIMER =
  "Not an investment. Not a solicitation. Affordability estimates are illustrative based on standard mortgage qualification ratios and do not constitute a loan offer or guarantee of qualification. Actual qualification varies by lender, credit profile, and property. Co-ownership in reSpace properties is structured through membership interests in single-purpose LLCs. Fair Housing Act applies to all property listings and reservations.";

type Phase =
  | "form"
  | "result"
  | "captured"
  | "property"
  | "lead-submitted";

export function AffordabilityApp() {
  const [phase, setPhase] = useState<Phase>("form");
  const [income, setIncome] = useState("");
  const [debts, setDebts] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [metro, setMetro] = useState<string>(METROS[0].value);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [capturing, setCapturing] = useState(false);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pendingSlugFromUrl, setPendingSlugFromUrl] = useState<string | null>(
    null
  );
  const [utm, setUtm] = useState<{ campaign?: string; source?: string }>({});

  // Read ?property=<slug>&utm_source=...&utm_campaign=... on mount so share
  // links can deep-link to a specific property after the calculator runs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("property");
    const utmSource = params.get("utm_source") ?? undefined;
    const utmCampaign = params.get("utm_campaign") ?? undefined;
    if (slug) setPendingSlugFromUrl(slug);
    if (utmSource || utmCampaign) setUtm({ source: utmSource, campaign: utmCampaign });
  }, []);

  const selectedProperty = useMemo(
    () => (selectedSlug ? getProperty(selectedSlug) : undefined),
    [selectedSlug]
  );

  function parseNumeric(v: string): number {
    return Number(v.replace(/[^0-9.]/g, "")) || 0;
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const annualIncome = parseNumeric(income);
    const monthlyDebts = parseNumeric(debts);
    const downP = parseNumeric(downPayment);

    const errs: Record<string, string> = {};
    if (!annualIncome || annualIncome <= 0) {
      errs.income = "Please enter a valid income.";
    } else if (annualIncome > 10000000) {
      errs.income = "Income cannot exceed $10,000,000.";
    }
    if (monthlyDebts > annualIncome / 12) {
      errs.debts = "Monthly debts cannot exceed your monthly income.";
    }
    if (downP > 5000000) {
      errs.downPayment = "Down payment cannot exceed $5,000,000.";
    }
    if (downP < 0) {
      errs.downPayment = "Down payment cannot be negative.";
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const inputs: AffordabilityInputs = {
      annualIncome,
      monthlyDebts,
      downPayment: downP,
      metro,
    };
    const r = calculateAffordability(inputs);
    setResult(r);
    setPhase("result");

    setTimeout(() => {
      document
        .getElementById("affordability-result")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError("");
    setCapturing(true);

    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          metro,
          annualIncome: parseNumeric(income),
          monthlyDebts: parseNumeric(debts),
          downPayment: parseNumeric(downPayment),
          soloMaxHomeValue: result?.solo.maxHomeValue,
          coOwnerMaxHomeValue: result?.coOwner.maxHomeValue,
          estimatedMonthlyPayment: result?.solo.estimatedMonthlyPayment,
          gap: result?.gap,
        }),
      });
    } catch (err) {
      console.warn("[affordability] capture failed", err);
    } finally {
      setCapturing(false);

      // If they arrived via a friend's share link, jump straight to the property.
      if (pendingSlugFromUrl && getProperty(pendingSlugFromUrl)) {
        setSelectedSlug(pendingSlugFromUrl);
        setPendingSlugFromUrl(null);
        setPhase("property");
      } else {
        setPhase("captured");
      }

      setTimeout(() => {
        document
          .getElementById("after-capture")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  function handleSelectProperty(slug: string) {
    setSelectedSlug(slug);
    setPhase("property");
    setTimeout(() => {
      document
        .getElementById("after-capture")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function handleBackToGallery() {
    setSelectedSlug(null);
    setPhase("captured");
    setTimeout(() => {
      document
        .getElementById("after-capture")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function handleLeadSubmitted() {
    setPhase("lead-submitted");
    setTimeout(() => {
      document
        .getElementById("after-capture")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  const showResultSection = phase !== "form" && result;
  const showEmailGate = phase === "result";
  const showGallery = phase === "captured";
  const showPropertyDetail = phase === "property" && selectedProperty;
  const showLeadSubmitted = phase === "lead-submitted" && selectedProperty;
  const showShareAndFoundation =
    phase === "captured" || phase === "lead-submitted";

  return (
    <div
      style={{
        background: T.navy,
        color: T.textOnDark,
        fontFamily: T.fontBody,
        minHeight: "100vh",
      }}
    >
      <FontLoader />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "120px 24px 64px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: T.fontDisplay,
            fontSize: "clamp(120px, 24vw, 320px)",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.04)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          AFFORD
        </span>
        <div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.3em",
              color: T.coral,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            reSpace · Affordability
          </p>
          <h1
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              color: T.textOnDark,
            }}
          >
            Find out what you{" "}
            <em style={{ fontStyle: "italic", color: T.coral }}>
              could really afford.
            </em>
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.65,
              color: T.textMuted,
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            You already pay every month. The math below shows what that same
            payment buys you solo versus alongside three co-owners. Real
            numbers. Your metro.
          </p>
        </div>
      </section>

      {/* FORM (phase: form) */}
      {phase === "form" ? (
        <section style={{ padding: "0 24px 96px" }}>
          <form
            onSubmit={handleCalculate}
            style={{
              maxWidth: 720,
              margin: "0 auto",
              background: T.navySoft,
              border: `1px solid ${T.borderOnDark}`,
              borderRadius: 4,
              padding: "40px 32px",
            }}
          >
            <h2
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 32,
                fontWeight: 700,
                color: T.textOnDark,
                marginBottom: 28,
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
              }}
            >
              Four numbers. That is all we need.
            </h2>

            <Field
              label="Annual household income"
              helper="Pre-tax, all earners combined."
              error={errors.income}
              value={income}
              onChange={setIncome}
              placeholder="85000"
              prefix="$"
            />
            <Field
              label="Existing monthly debt payments"
              helper="Car loans, student loans, credit card minimums. Not rent or current mortgage."
              error={errors.debts}
              value={debts}
              onChange={setDebts}
              placeholder="450"
              prefix="$"
            />
            <Field
              label="Available down payment"
              helper="Cash and savings you can put toward closing."
              error={errors.downPayment}
              value={downPayment}
              onChange={setDownPayment}
              placeholder="25000"
              prefix="$"
            />
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.textOnDark,
                  marginBottom: 8,
                }}
              >
                Target metro
              </label>
              <select
                value={metro}
                onChange={(e) => setMetro(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: `1px solid ${T.borderOnDark}`,
                  borderRadius: 2,
                  color: T.textOnDark,
                  fontFamily: T.fontBody,
                  fontSize: 16,
                  appearance: "none",
                  backgroundImage:
                    "linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.5) 50%), linear-gradient(135deg, rgba(255,255,255,0.5) 50%, transparent 50%)",
                  backgroundPosition:
                    "calc(100% - 20px) 50%, calc(100% - 14px) 50%",
                  backgroundSize: "6px 6px",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {METROS.map((m) => (
                  <option
                    key={m.value}
                    value={m.value}
                    style={{ background: T.navySoft }}
                  >
                    {m.value}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "18px 24px",
                background: T.coral,
                color: T.white,
                fontFamily: T.fontBody,
                fontSize: 16,
                fontWeight: 700,
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                transition: "background 200ms ease, transform 150ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = T.coralHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = T.coral)
              }
            >
              Show Me What&apos;s Possible
            </button>
          </form>
        </section>
      ) : null}

      {/* TWO-COLUMN RESULT + MONEY MOMENT (phases: result, captured, property, lead-submitted) */}
      {showResultSection && result ? (
        <ResultSection result={result} metro={metro} compact={phase !== "result"} />
      ) : null}

      {/* EMAIL GATE (phase: result only) */}
      {showEmailGate ? (
        <EmailCaptureBlock
          metro={metro}
          email={email}
          onEmailChange={setEmail}
          emailError={emailError}
          capturing={capturing}
          onSubmit={handleCapture}
        />
      ) : null}

      {/* Anchor for post-capture scroll */}
      <div id="after-capture" />

      {/* GALLERY (phase: captured) */}
      {showGallery && result ? (
        <PropertyGallery
          metro={metro}
          shareCeiling={result.solo.maxHomeValue}
          onSelect={handleSelectProperty}
        />
      ) : null}

      {/* PROPERTY DETAIL + LEAD FORM (phase: property) */}
      {showPropertyDetail && result && selectedProperty ? (
        <PropertyDetail
          property={selectedProperty}
          affordability={result}
          metro={metro}
          income={parseNumeric(income)}
          debts={parseNumeric(debts)}
          downPayment={parseNumeric(downPayment)}
          initialEmail={email}
          utm={utm}
          onBack={handleBackToGallery}
          onSubmitted={handleLeadSubmitted}
        />
      ) : null}

      {/* THANK YOU (phase: lead-submitted) */}
      {showLeadSubmitted && selectedProperty ? (
        <LeadSubmittedBlock
          propertyName={selectedProperty.name}
          propertySlug={selectedProperty.slug}
          onBackToGallery={handleBackToGallery}
        />
      ) : null}

      {/* FOUNDATION NOTE + CTAs + SHARE (captured + lead-submitted phases) */}
      {showShareAndFoundation ? (
        <FooterBlocks
          shareSlug={selectedProperty?.slug}
          shareContext={
            phase === "lead-submitted" && selectedProperty
              ? selectedProperty.name
              : undefined
          }
        />
      ) : null}

      {/* DISCLAIMER */}
      <footer
        style={{
          borderTop: `1px solid ${T.borderOnDark}`,
          padding: "32px 24px 48px",
          background: T.navy,
        }}
      >
        <p
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            fontSize: 12,
            lineHeight: 1.65,
            color: T.textMuted,
          }}
        >
          {STRIPE_DISCLAIMER}
        </p>
      </footer>
    </div>
  );
}

function FontLoader() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function Field({
  label,
  helper,
  error,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  helper?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: T.textOnDark,
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix ? (
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.textMuted,
              fontFamily: T.fontBody,
              fontSize: 16,
              pointerEvents: "none",
            }}
          >
            {prefix}
          </span>
        ) : null}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: `14px 16px 14px ${prefix ? 32 : 16}px`,
            background: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${error ? T.coral : T.borderOnDark}`,
            borderRadius: 2,
            color: T.textOnDark,
            fontFamily: T.fontBody,
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      {helper && !error ? (
        <p
          style={{
            fontSize: 12,
            color: T.textMuted,
            marginTop: 6,
            lineHeight: 1.45,
          }}
        >
          {helper}
        </p>
      ) : null}
      {error ? (
        <p
          style={{
            fontSize: 12,
            color: T.coral,
            marginTop: 6,
            fontWeight: 600,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ResultSection({
  result,
  metro,
  compact,
}: {
  result: AffordabilityResult;
  metro: string;
  compact: boolean;
}) {
  if (!result.feasible) {
    return (
      <section
        id="affordability-result"
        style={{ padding: "60px 24px 80px", textAlign: "center" }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 32,
              fontWeight: 600,
              color: T.textOnDark,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            Your inputs suggest current debt levels make a new home purchase
            difficult right now.
          </p>
          <p style={{ color: T.textMuted, fontSize: 16, lineHeight: 1.6 }}>
            We are still here when you are ready. Adjust the inputs above and
            re-run the math any time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="affordability-result"
        style={{
          padding: compact ? "32px 24px 32px" : "40px 24px 60px",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: 900,
            background:
              "radial-gradient(closest-side, rgba(232,96,76,0.10), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          <ResultCard
            eyebrow="ON YOUR OWN"
            maxHome={result.solo.maxHomeValue}
            sub="your max home value"
            monthly={result.solo.estimatedMonthlyPayment}
            monthlySub="your monthly payment"
            metroLine={`${metro} median home: ${fmtUSD(medianFor(metro))}`}
            accent="muted"
            compact={compact}
          />
          <ResultCard
            eyebrow="AS A CO-OWNER"
            maxHome={result.coOwner.maxHomeValue}
            sub="the full home you would co-own"
            monthly={result.coOwner.estimatedMonthlyShare}
            monthlySub="your monthly share"
            metroLine={`Your share alongside ${result.coOwner.groupSize - 1} other co-owners`}
            accent="warm"
            compact={compact}
          />
        </div>
      </section>

      {/* Money moment band */}
      <section
        style={{
          background:
            "linear-gradient(180deg, #1A1A2E 0%, #2A1410 100%)",
          padding: compact ? "56px 24px" : "80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: T.fontDisplay,
            fontSize: "clamp(160px, 28vw, 380px)",
            fontWeight: 700,
            color: "rgba(232, 96, 76, 0.05)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          MORE
        </span>
        <div
          style={{ position: "relative", maxWidth: 880, margin: "0 auto" }}
        >
          <h2
            style={{
              fontFamily: T.fontDisplay,
              fontSize: compact
                ? "clamp(28px, 4.2vw, 48px)"
                : "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 18,
              color: T.textOnDark,
            }}
          >
            That&apos;s{" "}
            <em style={{ fontStyle: "italic", color: T.coral }}>
              {fmtUSD(result.gap)} more home.
            </em>{" "}
            Same monthly payment.
          </h2>
          <p
            style={{
              fontSize: 19,
              color: T.textMuted,
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            You already pay. Now own what you pay for.
          </p>
        </div>
      </section>
    </>
  );
}

function ResultCard({
  eyebrow,
  maxHome,
  sub,
  monthly,
  monthlySub,
  metroLine,
  accent,
  compact,
}: {
  eyebrow: string;
  maxHome: number;
  sub: string;
  monthly: number;
  monthlySub: string;
  metroLine: string;
  accent: "muted" | "warm";
  compact: boolean;
}) {
  const isWarm = accent === "warm";
  return (
    <div
      style={{
        background: isWarm
          ? "rgba(232, 96, 76, 0.08)"
          : "rgba(255, 255, 255, 0.04)",
        border: `1px solid ${
          isWarm ? "rgba(232, 96, 76, 0.45)" : T.borderOnDark
        }`,
        borderRadius: 4,
        padding: compact ? "28px 28px" : "40px 32px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.25em",
          color: isWarm ? T.coral : T.textMuted,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        {eyebrow}
      </p>
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: isWarm
            ? "clamp(40px, 6.5vw, 80px)"
            : "clamp(36px, 5.5vw, 64px)",
          fontWeight: 700,
          color: isWarm ? T.coral : T.textOnDark,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          marginBottom: 8,
        }}
      >
        {fmtUSD(maxHome)}
      </p>
      <p
        style={{
          fontSize: 14,
          color: T.textMuted,
          marginBottom: 28,
        }}
      >
        {sub}
      </p>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          color: T.textMuted,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        Estimated monthly
      </p>
      <p
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 28,
          fontWeight: 600,
          color: T.textOnDark,
          marginBottom: 4,
          lineHeight: 1.1,
        }}
      >
        {fmtUSD(monthly)}/mo
      </p>
      <p
        style={{
          fontSize: 13,
          color: T.textMuted,
          marginBottom: 20,
        }}
      >
        {monthlySub}
      </p>
      <div
        style={{
          height: 1,
          background: T.borderOnDark,
          marginBottom: 16,
        }}
      />
      <p
        style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55 }}
      >
        {metroLine}
      </p>
    </div>
  );
}

function EmailCaptureBlock({
  metro,
  email,
  onEmailChange,
  emailError,
  capturing,
  onSubmit,
}: {
  metro: string;
  email: string;
  onEmailChange: (v: string) => void;
  emailError: string;
  capturing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section style={{ padding: "60px 24px 80px" }}>
      <form
        onSubmit={onSubmit}
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: T.navySoft,
          border: `1px solid ${T.borderOnDark}`,
          borderRadius: 4,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 30,
            fontWeight: 700,
            color: T.textOnDark,
            marginBottom: 12,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          See what&apos;s possible in {metro}.
        </h3>
        <p
          style={{
            fontSize: 15,
            color: T.textMuted,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          We&apos;ll send you your full result and show you properties you
          could be a co-owner of right now.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@yourdomain.com"
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            background: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${emailError ? T.coral : T.borderOnDark}`,
            borderRadius: 2,
            color: T.textOnDark,
            fontFamily: T.fontBody,
            fontSize: 16,
            outline: "none",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />
        {emailError ? (
          <p
            style={{
              fontSize: 13,
              color: T.coral,
              marginBottom: 8,
              textAlign: "left",
            }}
          >
            {emailError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={capturing}
          style={{
            width: "100%",
            padding: 16,
            background: T.coral,
            color: T.white,
            fontFamily: T.fontBody,
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            borderRadius: 2,
            cursor: capturing ? "default" : "pointer",
            opacity: capturing ? 0.6 : 1,
            transition: "background 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (!capturing) e.currentTarget.style.background = T.coralHover;
          }}
          onMouseLeave={(e) => {
            if (!capturing) e.currentTarget.style.background = T.coral;
          }}
        >
          {capturing ? "Sending..." : "See My Properties"}
        </button>
      </form>
    </section>
  );
}

function LeadSubmittedBlock({
  propertyName,
  propertySlug,
  onBackToGallery,
}: {
  propertyName: string;
  propertySlug: string;
  onBackToGallery: () => void;
}) {
  return (
    <section style={{ padding: "80px 24px 40px" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: T.fontBody,
            fontSize: 13,
            letterSpacing: "0.15em",
            color: T.coral,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Interest received
        </p>
        <h2
          style={{
            fontFamily: T.fontDisplay,
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 700,
            color: T.textOnDark,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          Thanks. A reSpace broker will reach out within{" "}
          <em style={{ fontStyle: "italic", color: T.coral }}>24 hours</em>{" "}
          about {propertyName}.
        </h2>
        <p
          style={{
            fontSize: 17,
            color: T.textMuted,
            lineHeight: 1.65,
            maxWidth: 560,
            margin: "0 auto 28px",
          }}
        >
          While you wait, send this calculator to anyone you&apos;d want to
          co-own {propertyName}{" "}with. They&apos;ll run their own number and
          we&apos;ll put a group together.
        </p>
        <button
          type="button"
          onClick={onBackToGallery}
          style={{
            background: "transparent",
            border: `1px solid ${T.textMuted}`,
            color: T.textOnDark,
            fontFamily: T.fontBody,
            fontSize: 14,
            fontWeight: 700,
            padding: "12px 24px",
            borderRadius: 2,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          Browse more properties
        </button>
        <p style={{ display: "none" }}>{propertySlug}</p>
      </div>
    </section>
  );
}

function FooterBlocks({
  shareSlug,
  shareContext,
}: {
  shareSlug?: string;
  shareContext?: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined")
      return "https://respace.co/affordability";
    const base = `${window.location.origin}${window.location.pathname}`;
    if (!shareSlug) return base;
    const params = new URLSearchParams({
      property: shareSlug,
      utm_source: "friend",
      utm_campaign: "affordability_share",
    });
    return `${base}?${params.toString()}`;
  }, [shareSlug]);

  function copy() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      {/* Foundation note */}
      <section style={{ padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            background: T.sand,
            border: `1px solid rgba(124, 154, 126, 0.25)`,
            borderRadius: 4,
            padding: 32,
          }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: T.navy,
            }}
          >
            <strong style={{ color: T.coral }}>1% of every reSpace sale</strong>{" "}
            supports The reSpace Foundation, a 501(c)(3) nonprofit working on
            housing access in our communities.
          </p>
        </div>
      </section>

      {/* Primary CTAs */}
      <section style={{ padding: "40px 24px 24px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 56,
          }}
        >
          <a
            href={HOLD_YOUR_SPACE_URL}
            style={{
              padding: "16px 28px",
              background: T.coral,
              color: T.white,
              fontFamily: T.fontBody,
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 2,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            Hold Your Space. $250 refundable.
          </a>
          <a
            href={BUYER_POOL_URL}
            style={{
              padding: "16px 28px",
              background: "transparent",
              color: T.textOnDark,
              fontFamily: T.fontBody,
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 2,
              textDecoration: "none",
              border: `1.5px solid ${T.textMuted}`,
              letterSpacing: "0.01em",
            }}
          >
            Join the Buyer Pool
          </a>
        </div>

        {/* Share block */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h4
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 24,
              fontWeight: 600,
              color: T.textOnDark,
              marginBottom: 16,
              letterSpacing: "-0.005em",
              lineHeight: 1.2,
            }}
          >
            Send this to someone who thinks they can&apos;t afford a home.
          </h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <ShareButton label={copied ? "Copied" : "Copy Link"} onClick={copy} />
            <a
              href={`mailto:?subject=${encodeURIComponent(
                shareContext
                  ? `What you could afford at ${shareContext}`
                  : "What you could afford as a reSpace co-owner"
              )}&body=${encodeURIComponent(
                `I just used this affordability calculator and thought of you: ${shareUrl}`
              )}`}
              style={shareLinkStyle}
            >
              Email
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(
                `What you could afford as a reSpace co-owner: ${shareUrl}`
              )}`}
              style={shareLinkStyle}
            >
              Text
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const shareLinkStyle: React.CSSProperties = {
  padding: "10px 18px",
  background: "rgba(255, 255, 255, 0.06)",
  color: T.textOnDark,
  borderRadius: 999,
  fontFamily: T.fontBody,
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
  border: `1px solid ${T.borderOnDark}`,
};

function ShareButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{ ...shareLinkStyle, cursor: "pointer" }}>
      {label}
    </button>
  );
}

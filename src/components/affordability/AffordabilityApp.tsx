"use client";

import { useState } from "react";
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
} from "@/lib/affordability/config";

// reSpace branding (scoped to this page only — does not pollute Savvy theme).
// Dark navy + terracotta accent + Clash Display + DM Sans.
const THEME = {
  bgPrimary: "#1A1F2E",
  bgSecondary: "#232838",
  textPrimary: "#F5F1EA",
  textSecondary: "#B5AFA3",
  accentWarm: "#C97B4A",
  accentGold: "#D4A85A",
  borderSubtle: "rgba(245, 241, 234, 0.1)",
  fontDisplay:
    '"Clash Display", "Cormorant Garamond", Georgia, "Times New Roman", serif',
  fontBody: '"DM Sans", system-ui, -apple-system, sans-serif',
};

const STRIPE_DISCLAIMER =
  "Not an investment. Not a solicitation. Affordability estimates are illustrative based on standard mortgage qualification ratios and do not constitute a loan offer or guarantee of qualification. Actual qualification varies by lender, credit profile, and property. Co-ownership in reSpace properties is structured through membership interests in single-purpose LLCs. Fair Housing Act applies to all property listings and reservations.";

type Phase = "form" | "result" | "captured";

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

    // Smooth scroll to result section after state updates render
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
      setPhase("captured");
      setTimeout(() => {
        document
          .getElementById("affordability-detail")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  function copyShareLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "https://www.thesavvydigitalco.com/affordability";

  return (
    <div
      style={{
        background: THEME.bgPrimary,
        color: THEME.textPrimary,
        fontFamily: THEME.fontBody,
        minHeight: "100vh",
      }}
    >
      <FontLoader />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "120px 24px 80px",
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
            fontFamily: THEME.fontDisplay,
            fontSize: "clamp(120px, 24vw, 320px)",
            fontWeight: 700,
            color: "rgba(245, 241, 234, 0.04)",
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
              color: THEME.accentWarm,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            reSpace · Affordability
          </p>
          <h1
            style={{
              fontFamily: THEME.fontDisplay,
              fontSize: "clamp(40px, 5.8vw, 72px)",
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Find out what you{" "}
            <em
              style={{ fontStyle: "italic", color: THEME.accentWarm }}
            >
              could really afford.
            </em>
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: THEME.textSecondary,
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

      {/* FORM */}
      <section style={{ padding: "0 24px 80px" }}>
        <form
          onSubmit={handleCalculate}
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: THEME.bgSecondary,
            border: `1px solid ${THEME.borderSubtle}`,
            borderRadius: 16,
            padding: "40px 32px",
          }}
        >
          <h2
            style={{
              fontFamily: THEME.fontDisplay,
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 28,
              letterSpacing: "-0.01em",
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
                fontSize: 14,
                fontWeight: 500,
                color: THEME.textPrimary,
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
                background: "rgba(245, 241, 234, 0.06)",
                border: `1px solid ${THEME.borderSubtle}`,
                borderRadius: 10,
                color: THEME.textPrimary,
                fontFamily: THEME.fontBody,
                fontSize: 16,
                appearance: "none",
                backgroundImage:
                  "linear-gradient(45deg, transparent 50%, rgba(245,241,234,0.5) 50%), linear-gradient(135deg, rgba(245,241,234,0.5) 50%, transparent 50%)",
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
                  style={{ background: THEME.bgSecondary }}
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
              background: THEME.accentWarm,
              color: THEME.bgPrimary,
              fontFamily: THEME.fontDisplay,
              fontSize: 18,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              transition: "background 200ms ease, transform 150ms ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = THEME.accentGold)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = THEME.accentWarm)
            }
          >
            Show Me What's Possible
          </button>
        </form>
      </section>

      {/* RESULT */}
      {phase !== "form" && result && (
        <ResultSection
          result={result}
          metro={metro}
          phase={phase}
          email={email}
          onEmailChange={setEmail}
          emailError={emailError}
          capturing={capturing}
          onCapture={handleCapture}
          copyShareLink={copyShareLink}
          shareUrl={shareUrl}
        />
      )}

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${THEME.borderSubtle}`,
          padding: "32px 24px 48px",
          background: THEME.bgPrimary,
        }}
      >
        <p
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            fontSize: 12,
            lineHeight: 1.6,
            color: THEME.textSecondary,
          }}
        >
          {STRIPE_DISCLAIMER}
        </p>
      </footer>
    </div>
  );
}

function FontLoader() {
  // Inject Clash Display + DM Sans Google Fonts links once.
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
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
          fontSize: 14,
          fontWeight: 500,
          color: THEME.textPrimary,
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
              color: THEME.textSecondary,
              fontFamily: THEME.fontBody,
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
            background: "rgba(245, 241, 234, 0.06)",
            border: `1px solid ${
              error ? THEME.accentWarm : THEME.borderSubtle
            }`,
            borderRadius: 10,
            color: THEME.textPrimary,
            fontFamily: THEME.fontBody,
            fontSize: 16,
            outline: "none",
          }}
        />
      </div>
      {helper && !error ? (
        <p
          style={{
            fontSize: 12,
            color: THEME.textSecondary,
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          {helper}
        </p>
      ) : null}
      {error ? (
        <p
          style={{
            fontSize: 12,
            color: THEME.accentWarm,
            marginTop: 6,
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const THEME_C = THEME;

function ResultSection({
  result,
  metro,
  phase,
  email,
  onEmailChange,
  emailError,
  capturing,
  onCapture,
  copyShareLink,
  shareUrl,
}: {
  result: AffordabilityResult;
  metro: string;
  phase: Phase;
  email: string;
  onEmailChange: (v: string) => void;
  emailError: string;
  capturing: boolean;
  onCapture: (e: React.FormEvent) => void;
  copyShareLink: () => void;
  shareUrl: string;
}) {
  if (!result.feasible) {
    return (
      <section
        id="affordability-result"
        style={{ padding: "60px 24px 80px", textAlign: "center" }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: THEME.fontDisplay,
              fontSize: 32,
              fontWeight: 500,
              color: THEME.textPrimary,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            Your inputs suggest current debt levels make a new home purchase
            difficult right now.
          </p>
          <p style={{ color: THEME.textSecondary, fontSize: 16 }}>
            We are still here when you are ready. Adjust the inputs above and
            re-run the math any time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Two-column comparison */}
      <section
        id="affordability-result"
        style={{
          padding: "40px 24px 60px",
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
              "radial-gradient(closest-side, rgba(201, 123, 74, 0.10), transparent 70%)",
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
          />
          <ResultCard
            eyebrow="AS A CO-OWNER"
            maxHome={result.coOwner.maxHomeValue}
            sub="the full home you would co-own"
            monthly={result.coOwner.estimatedMonthlyShare}
            monthlySub="your monthly share"
            metroLine={`Your share alongside ${
              result.coOwner.groupSize - 1
            } other co-owners`}
            accent="warm"
          />
        </div>
      </section>

      {/* Money moment band */}
      <section
        style={{
          background: "linear-gradient(180deg, #1A1F2E 0%, #2A2010 100%)",
          padding: "80px 24px",
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
            fontFamily: THEME.fontDisplay,
            fontSize: "clamp(160px, 28vw, 380px)",
            fontWeight: 700,
            color: "rgba(201, 123, 74, 0.05)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          MORE
        </span>
        <div style={{ position: "relative", maxWidth: 880, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: THEME.fontDisplay,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 18,
            }}
          >
            That's{" "}
            <em
              style={{ fontStyle: "italic", color: THEME.accentWarm }}
            >
              {fmtUSD(result.gap)} more home.
            </em>{" "}
            Same monthly payment.
          </h2>
          <p
            style={{
              fontSize: 19,
              color: THEME.textSecondary,
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            You already pay. Now own what you pay for.
          </p>
        </div>
      </section>

      {/* Email capture or detailed view */}
      {phase === "result" ? (
        <EmailCaptureBlock
          metro={metro}
          email={email}
          onEmailChange={onEmailChange}
          emailError={emailError}
          capturing={capturing}
          onSubmit={onCapture}
        />
      ) : (
        <FullDetailView
          result={result}
          metro={metro}
          shareUrl={shareUrl}
          copyShareLink={copyShareLink}
        />
      )}
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
}: {
  eyebrow: string;
  maxHome: number;
  sub: string;
  monthly: number;
  monthlySub: string;
  metroLine: string;
  accent: "muted" | "warm";
}) {
  const isWarm = accent === "warm";
  return (
    <div
      style={{
        background: isWarm
          ? "rgba(201, 123, 74, 0.08)"
          : "rgba(245, 241, 234, 0.04)",
        border: `1px solid ${
          isWarm ? "rgba(201, 123, 74, 0.4)" : THEME_C.borderSubtle
        }`,
        borderRadius: 16,
        padding: "40px 32px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          color: isWarm ? THEME_C.accentWarm : THEME_C.textSecondary,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        {eyebrow}
      </p>
      <p
        style={{
          fontFamily: THEME_C.fontDisplay,
          fontSize: isWarm ? "clamp(48px, 7vw, 88px)" : "clamp(42px, 6vw, 72px)",
          fontWeight: 600,
          color: isWarm ? THEME_C.accentWarm : THEME_C.textPrimary,
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
          color: THEME_C.textSecondary,
          marginBottom: 28,
        }}
      >
        {sub}
      </p>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          color: THEME_C.textSecondary,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        Estimated monthly
      </p>
      <p
        style={{
          fontFamily: THEME_C.fontDisplay,
          fontSize: 28,
          fontWeight: 500,
          color: THEME_C.textPrimary,
          marginBottom: 4,
          lineHeight: 1.1,
        }}
      >
        {fmtUSD(monthly)}/mo
      </p>
      <p
        style={{
          fontSize: 13,
          color: THEME_C.textSecondary,
          marginBottom: 24,
        }}
      >
        {monthlySub}
      </p>
      <div
        style={{
          height: 1,
          background: THEME_C.borderSubtle,
          marginBottom: 18,
        }}
      />
      <p style={{ fontSize: 13, color: THEME_C.textSecondary, lineHeight: 1.5 }}>
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
          background: THEME_C.bgSecondary,
          border: `1px solid ${THEME_C.borderSubtle}`,
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontFamily: THEME_C.fontDisplay,
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          See what's possible in {metro}.
        </h3>
        <p
          style={{
            fontSize: 15,
            color: THEME_C.textSecondary,
            marginBottom: 24,
            lineHeight: 1.55,
          }}
        >
          We&apos;ll send you your full result plus an invitation to Hold Your
          Space.
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
            background: "rgba(245, 241, 234, 0.06)",
            border: `1px solid ${
              emailError ? THEME_C.accentWarm : THEME_C.borderSubtle
            }`,
            borderRadius: 10,
            color: THEME_C.textPrimary,
            fontFamily: THEME_C.fontBody,
            fontSize: 16,
            outline: "none",
            marginBottom: 8,
          }}
        />
        {emailError ? (
          <p
            style={{
              fontSize: 13,
              color: THEME_C.accentWarm,
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
            padding: "16px",
            background: THEME_C.accentWarm,
            color: THEME_C.bgPrimary,
            fontFamily: THEME_C.fontDisplay,
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            borderRadius: 10,
            cursor: capturing ? "default" : "pointer",
            opacity: capturing ? 0.7 : 1,
            transition: "background 200ms ease",
          }}
        >
          {capturing ? "Sending…" : "Get the Full Picture"}
        </button>
      </form>
    </section>
  );
}

function FullDetailView({
  result,
  metro,
  shareUrl,
  copyShareLink,
}: {
  result: AffordabilityResult;
  metro: string;
  shareUrl: string;
  copyShareLink: () => void;
}) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    copyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div id="affordability-detail" style={{ padding: "20px 0 80px" }}>
      {/* Monthly composition */}
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h3
            style={{
              fontFamily: THEME_C.fontDisplay,
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 600,
              marginBottom: 8,
              letterSpacing: "-0.015em",
              textAlign: "center",
            }}
          >
            Where your monthly payment goes.
          </h3>
          <p
            style={{
              fontSize: 15,
              color: THEME_C.textSecondary,
              textAlign: "center",
              marginBottom: 36,
            }}
          >
            Same monthly outlay. Different home unlocked.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            <BreakdownCard label="On your own" breakdown={result.solo.breakdown} total={result.solo.estimatedMonthlyPayment} />
            <BreakdownCard label="As a co-owner" breakdown={result.coOwner.breakdown} total={result.coOwner.estimatedMonthlyShare} accent />
          </div>
        </div>
      </section>

      {/* Property gallery placeholders */}
      <section style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h3
            style={{
              fontFamily: THEME_C.fontDisplay,
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 600,
              marginBottom: 28,
              letterSpacing: "-0.015em",
              textAlign: "center",
            }}
          >
            What this could look like in {metro}.
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[1, 2, 3].map((i) => (
              <PropertyPlaceholder key={i} index={i} metro={metro} value={result.coOwner.maxHomeValue} />
            ))}
          </div>
        </div>
      </section>

      {/* Foundation note */}
      <section style={{ padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            background: "rgba(212, 168, 90, 0.08)",
            border: `1px solid rgba(212, 168, 90, 0.2)`,
            borderRadius: 12,
            padding: 32,
          }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: THEME_C.textPrimary,
            }}
          >
            1% of every reSpace sale supports The reSpace Foundation, a 501(c)(3) nonprofit working on housing access in our communities.
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section style={{ padding: "40px 24px 60px", textAlign: "center" }}>
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
              padding: "18px 32px",
              background: THEME_C.accentWarm,
              color: THEME_C.bgPrimary,
              fontFamily: THEME_C.fontDisplay,
              fontSize: 18,
              fontWeight: 600,
              borderRadius: 10,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            Hold Your Space — $250 refundable
          </a>
          <a
            href={BUYER_POOL_URL}
            style={{
              padding: "18px 32px",
              background: "transparent",
              color: THEME_C.textPrimary,
              fontFamily: THEME_C.fontDisplay,
              fontSize: 18,
              fontWeight: 600,
              borderRadius: 10,
              textDecoration: "none",
              border: `1px solid ${THEME_C.textSecondary}`,
              letterSpacing: "0.01em",
            }}
          >
            Join the Buyer Pool
          </a>
        </div>

        {/* Share */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h4
            style={{
              fontFamily: THEME_C.fontDisplay,
              fontSize: 22,
              fontWeight: 500,
              marginBottom: 16,
              letterSpacing: "-0.005em",
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
            <ShareButton label={copied ? "Copied" : "Copy Link"} onClick={doCopy} />
            <a
              href={`mailto:?subject=${encodeURIComponent(
                "What you could afford as a reSpace co-owner"
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
    </div>
  );
}

const shareLinkStyle: React.CSSProperties = {
  padding: "10px 18px",
  background: "rgba(245, 241, 234, 0.06)",
  color: THEME_C.textPrimary,
  borderRadius: 999,
  fontFamily: THEME_C.fontBody,
  fontSize: 14,
  fontWeight: 500,
  textDecoration: "none",
  border: `1px solid ${THEME_C.borderSubtle}`,
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

function BreakdownCard({
  label,
  breakdown,
  total,
  accent,
}: {
  label: string;
  breakdown: {
    mortgagePrincipalAndInterest: number;
    propertyTax: number;
    insurance: number;
    maintenanceReserve: number;
  };
  total: number;
  accent?: boolean;
}) {
  const items = [
    { name: "Mortgage P+I", value: breakdown.mortgagePrincipalAndInterest, color: THEME_C.textPrimary },
    { name: "Property tax", value: breakdown.propertyTax, color: THEME_C.accentGold },
    { name: "Insurance", value: breakdown.insurance, color: THEME_C.accentWarm },
    { name: "Maintenance reserve", value: breakdown.maintenanceReserve, color: "rgba(181, 175, 163, 0.7)" },
  ];
  return (
    <div
      style={{
        background: accent ? "rgba(201, 123, 74, 0.08)" : "rgba(245, 241, 234, 0.04)",
        border: `1px solid ${accent ? "rgba(201, 123, 74, 0.4)" : THEME_C.borderSubtle}`,
        borderRadius: 14,
        padding: 28,
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          color: accent ? THEME_C.accentWarm : THEME_C.textSecondary,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 22 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              flex: it.value,
              background: it.color,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: it.color }} />
              <span style={{ fontSize: 13, color: THEME_C.textPrimary }}>{it.name}</span>
            </div>
            <span style={{ fontSize: 13, color: THEME_C.textPrimary, fontFamily: THEME_C.fontBody }}>{fmtUSD(it.value)}/mo</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: `1px solid ${THEME_C.borderSubtle}`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: THEME_C.textSecondary, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Total</span>
        <span style={{ fontFamily: THEME_C.fontDisplay, fontSize: 20, fontWeight: 600, color: accent ? THEME_C.accentWarm : THEME_C.textPrimary }}>
          {fmtUSD(total)}/mo
        </span>
      </div>
    </div>
  );
}

function PropertyPlaceholder({ index, metro, value }: { index: number; metro: string; value: number }) {
  const propertyTypes = ["4-bedroom craftsman", "5-bedroom mid-century", "4-bedroom Victorian"];
  const neighborhoods: Record<string, string[]> = {
    "Seattle, WA": ["Ballard", "Capitol Hill", "Ravenna"],
    "Bellevue, WA": ["Crossroads", "West Bellevue", "Newport Hills"],
    "Tacoma, WA": ["North End", "Stadium District", "Old Town"],
    "Olympia, WA": ["South Capitol", "Westside", "Eastside"],
    "Spokane, WA": ["South Hill", "Browne's Addition", "Manito"],
  };
  const hoods = neighborhoods[metro] ?? ["central", "north end", "south end"];
  return (
    <div
      style={{
        background: THEME_C.bgSecondary,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${THEME_C.borderSubtle}`,
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 3",
          background: "rgba(245, 241, 234, 0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: THEME_C.textSecondary,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Property photography placeholder
        </span>
      </div>
      <div style={{ padding: 18 }}>
        <p style={{ fontSize: 14, color: THEME_C.textPrimary, lineHeight: 1.5, marginBottom: 4 }}>
          {propertyTypes[index - 1]}, {hoods[index - 1]}
        </p>
        <p style={{ fontSize: 13, color: THEME_C.textSecondary }}>
          approximate {fmtUSD(value)} value
        </p>
      </div>
    </div>
  );
}

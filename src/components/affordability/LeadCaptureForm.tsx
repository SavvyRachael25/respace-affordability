"use client";

import { useState } from "react";
import { RESPACE_THEME } from "@/lib/affordability/config";
import type { ReSpaceProperty } from "@/lib/respace/properties";
import type { AffordabilityResult } from "@/lib/affordability/calculate";

const T = RESPACE_THEME;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadSubmission = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  sharePrice: number;
  suiteId?: string;
  suiteLabel?: string;
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  metro: string;
  affordabilityResult: AffordabilityResult;
  source: "respace-affordability-calculator";
  submittedAt: string;
  utmCampaign?: string;
  utmSource?: string;
};

export function LeadCaptureForm({
  property,
  initialEmail,
  affordability,
  metro,
  income,
  debts,
  downPayment,
  suiteId,
  suiteLabel,
  suiteSharePrice,
  utm,
  onSubmitted,
}: {
  property: ReSpaceProperty;
  initialEmail: string;
  affordability: AffordabilityResult;
  metro: string;
  income: number;
  debts: number;
  downPayment: number;
  suiteId?: string;
  suiteLabel?: string;
  suiteSharePrice?: number;
  utm: { campaign?: string; source?: string };
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please share your name.";
    if (!EMAIL_RX.test(email.trim())) errs.email = "Please enter a valid email.";
    if (phone.trim().replace(/\D/g, "").length < 10)
      errs.phone = "Please share a phone we can reach you at.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const submission: LeadSubmission = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
      propertyId: property.id,
      propertySlug: property.slug,
      propertyName: property.name,
      sharePrice: suiteSharePrice ?? property.sharePriceMin,
      suiteId,
      suiteLabel,
      annualIncome: income,
      monthlyDebts: debts,
      downPayment,
      metro,
      affordabilityResult: affordability,
      source: "respace-affordability-calculator",
      submittedAt: new Date().toISOString(),
      utmCampaign: utm.campaign,
      utmSource: utm.source,
    };

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch (err) {
      console.warn("[lead] submit failed", err);
    } finally {
      setSubmitting(false);
      onSubmitted();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 560,
        margin: "0 auto",
        background: T.white,
        borderRadius: 4,
        padding: "40px 36px",
        color: T.navy,
      }}
    >
      <p
        style={{
          fontFamily: T.fontBody,
          fontSize: 11,
          letterSpacing: "0.15em",
          color: T.coral,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {suiteLabel ? "You picked a suite" : "Step 2 of 2"}
      </p>
      <h3
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 28,
          fontWeight: 700,
          color: T.navy,
          letterSpacing: "-0.01em",
          marginBottom: 8,
          lineHeight: 1.15,
        }}
      >
        {suiteLabel
          ? `Tell us you want ${suiteLabel} at ${property.name}.`
          : "Tell our broker who you are."}
      </h3>
      <p
        style={{
          fontSize: 15,
          color: "#6B7280",
          marginBottom: 24,
          lineHeight: 1.55,
        }}
      >
        We&apos;ll attach your affordability profile and pass it to the reSpace
        broker handling{" "}
        {suiteLabel ? `${suiteLabel} at ${property.name}` : property.name}.
        They reach out within 24 hours.
      </p>

      <FormField
        label="Your name"
        value={name}
        onChange={setName}
        placeholder="Casey Park"
        error={errors.name}
      />
      <FormField
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="you@yourdomain.com"
        type="email"
        error={errors.email}
      />
      <FormField
        label="Phone"
        value={phone}
        onChange={setPhone}
        placeholder="(555) 555 5555"
        type="tel"
        error={errors.phone}
      />

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: T.navy,
            marginBottom: 6,
          }}
        >
          Tell us anything about who you&apos;d want to co-own{" "}
          {suiteLabel ? `${suiteLabel} at ${property.name}` : property.name}{" "}
          with (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          rows={4}
          placeholder="Friends, family, partner, open to a group match. Whatever feels right."
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            fontFamily: T.fontBody,
            border: "1.5px solid #D1D5DB",
            borderRadius: 2,
            background: T.white,
            color: T.navy,
            resize: "vertical",
            minHeight: 96,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <p
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#9CA3AF",
          }}
        >
          {notes.length} / 500
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: T.fontBody,
          color: T.white,
          background: T.coral,
          border: "none",
          borderRadius: 2,
          cursor: submitting ? "default" : "pointer",
          opacity: submitting ? 0.6 : 1,
          transition: "background 200ms ease",
        }}
      >
        {submitting
          ? "Sending..."
          : suiteLabel
          ? `Have a broker reach out about ${suiteLabel}`
          : "Have a broker reach out"}
      </button>

      <p
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: 12,
          color: "#6B7280",
          lineHeight: 1.5,
        }}
      >
        A reSpace broker reaches out within 24 hours. No spam. No pressure.
      </p>
    </form>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: T.navy,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 15,
          fontFamily: T.fontBody,
          border: `1.5px solid ${error ? T.coral : "#D1D5DB"}`,
          borderRadius: 2,
          background: T.white,
          color: T.navy,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {error ? (
        <p
          style={{
            marginTop: 6,
            fontSize: 12,
            color: T.coral,
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

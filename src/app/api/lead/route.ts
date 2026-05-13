import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 20;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stage 3 lead capture endpoint.
//
// BROKER FLOW
// -----------
// reSpace brokers do not work in GHL. They work in Follow Up Boss (FUB).
// GHL is the marketing automation + tag layer; tags + contact fields sync
// from GHL into FUB, which is where brokers pick up the lead.
//
// So the routing is:
//   /api/lead  →  GHL webhook (with tags + custom fields)
//                 ↓ GHL→FUB sync (handled in GHL settings)
//                 FUB contact created with tags carried over
//                 ↓ FUB smart list / pond rules
//                 Broker picks up lead
//
// Tags are the key. FUB brokers filter views by tag. The tag taxonomy
// generated below in buildGhlPayload() is the contract for what brokers
// see in FUB. Edit it carefully.
//
// CURRENT STATE
// -------------
// Stubbed. Validates input, logs the GHL-ready payload, returns a fake
// leadId. Real GHL routing is deferred. Wire by replacing the body of
// forwardLead() — buildGhlPayload() already produces the exact shape GHL
// expects.

type LeadSubmission = {
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
  affordabilityResult?: {
    solo?: { maxHomeValue?: number; estimatedMonthlyPayment?: number };
    coOwner?: { maxHomeValue?: number; estimatedMonthlyShare?: number };
    gap?: number;
  };
  source: string;
  submittedAt: string;
  utmCampaign?: string;
  utmSource?: string;
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const submission = body as unknown as LeadSubmission;

  if (!submission.name?.trim()) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RX.test(submission.email ?? "")) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }
  if ((submission.phone ?? "").replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "A valid phone is required." },
      { status: 400 }
    );
  }
  if (!submission.propertyId) {
    return NextResponse.json(
      { error: "Property reference is missing." },
      { status: 400 }
    );
  }

  const leadId = `lead_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const ghlPayload = buildGhlPayload(submission, leadId);
  await forwardLead(ghlPayload);

  return NextResponse.json({ ok: true, leadId });
}

// Build the exact shape we'll POST to GHL. Tags here are the contract
// FUB brokers will filter on; treat this taxonomy as a public interface.
function buildGhlPayload(s: LeadSubmission, leadId: string) {
  const [firstName, ...rest] = s.name.trim().split(/\s+/);
  const lastName = rest.join(" ");

  const soloMax = s.affordabilityResult?.solo?.maxHomeValue ?? 0;
  const sharePrice = s.sharePrice ?? 0;
  const withinReach = sharePrice > 0 && soloMax > 0 && sharePrice <= soloMax;
  const fitTag = withinReach
    ? "respace-fit-within-reach"
    : "respace-fit-stretch";

  const metroSlug = s.metro
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const tags = [
    "respace-buyer-pool",
    "respace-affordability-calc",
    "respace-lead-submitted",
    s.suiteId ? "respace-suite-claimed" : "respace-property-interested",
    `respace-property-${s.propertySlug}`,
    s.suiteId ? `respace-suite-${s.suiteId}` : null,
    metroSlug ? `respace-metro-${metroSlug}` : null,
    fitTag,
    s.utmSource ? `respace-utm-${s.utmSource}` : null,
  ].filter((t): t is string => Boolean(t));

  const claimSummary = s.suiteLabel
    ? `Claimed ${s.suiteLabel} at ${s.propertyName} ($${sharePrice.toLocaleString()})`
    : `Interested in ${s.propertyName} (share from $${sharePrice.toLocaleString()})`;
  const fitSummary = withinReach
    ? `Within reach. Solo max $${soloMax.toLocaleString()} vs share $${sharePrice.toLocaleString()}.`
    : `Stretch. Solo max $${soloMax.toLocaleString()} vs share $${sharePrice.toLocaleString()}.`;
  const noteSummary = [
    claimSummary,
    fitSummary,
    s.notes ? `Co-buyer notes: ${s.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    // Standard contact fields — these are what FUB will consume after sync.
    firstName: firstName ?? s.name,
    lastName: lastName || undefined,
    email: s.email.trim(),
    phone: s.phone.trim(),
    source: s.source || "respace-affordability-calculator",
    tags,

    // Custom fields — used in GHL automations and surfaced in FUB as
    // custom contact fields (mapping is defined in GHL→FUB sync settings).
    customFields: {
      respace_lead_id: leadId,
      respace_property_id: s.propertyId,
      respace_property_slug: s.propertySlug,
      respace_property_name: s.propertyName,
      respace_suite_id: s.suiteId ?? null,
      respace_suite_label: s.suiteLabel ?? null,
      respace_share_price: sharePrice,
      respace_metro: s.metro,
      respace_annual_income: s.annualIncome,
      respace_monthly_debts: s.monthlyDebts,
      respace_down_payment: s.downPayment,
      respace_solo_max_home: soloMax,
      respace_coowner_max_home:
        s.affordabilityResult?.coOwner?.maxHomeValue ?? 0,
      respace_monthly_payment:
        s.affordabilityResult?.solo?.estimatedMonthlyPayment ?? 0,
      respace_affordability_gap: s.affordabilityResult?.gap ?? 0,
      respace_within_reach: withinReach,
      respace_utm_source: s.utmSource ?? null,
      respace_utm_campaign: s.utmCampaign ?? null,
      respace_submitted_at: s.submittedAt,
    },

    // Plain-English summary the broker sees on the FUB contact card
    // before they open custom fields. Single most useful thing to skim.
    notes: noteSummary,
  };
}

async function forwardLead(payload: ReturnType<typeof buildGhlPayload>) {
  // STUB: log only.
  //
  // When wiring for real, this is the single line to add (read
  // NEXT_PUBLIC_RESPACE_LEAD_WEBHOOK from env):
  //
  //   await fetch(process.env.NEXT_PUBLIC_RESPACE_LEAD_WEBHOOK!, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //
  // GHL will receive the payload, apply tags, fire any automations, and
  // sync the contact (tags + custom fields) into FUB where the broker
  // picks it up.
  console.log("[lead] GHL-ready payload", JSON.stringify(payload, null, 2));
}

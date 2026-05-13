import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 20;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stage 3 lead capture endpoint.
//
// Stubbed: validates input, logs the payload server-side, returns a fake
// leadId. Real GHL + broker pipeline routing is intentionally deferred.
//
// Wire the real backend later by replacing the body of `forwardLead`.

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const propertyId =
    typeof body.propertyId === "string" ? body.propertyId : "";

  if (!name) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RX.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "A valid phone is required." },
      { status: 400 }
    );
  }
  if (!propertyId) {
    return NextResponse.json(
      { error: "Property reference is missing." },
      { status: 400 }
    );
  }

  const leadId = `lead_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  await forwardLead({ leadId, ...body });

  return NextResponse.json({ ok: true, leadId });
}

async function forwardLead(payload: Record<string, unknown>) {
  // STUB: log only. Real implementation lives here later (GHL webhook,
  // broker email, Supabase insert, whatever the team picks).
  console.log("[lead] received", JSON.stringify(payload));
}

import { NextResponse } from "next/server";
import { GHL_WEBHOOK_URL } from "@/lib/affordability/config";

export const runtime = "nodejs";
export const maxDuration = 20;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: string;
  metro?: string;
  annualIncome?: number;
  monthlyDebts?: number;
  downPayment?: number;
  soloMaxHomeValue?: number;
  coOwnerMaxHomeValue?: number;
  estimatedMonthlyPayment?: number;
  gap?: number;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email } = body;
  if (!email || !EMAIL_RX.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email." },
      { status: 400 }
    );
  }

  // Forward to GHL webhook. Fail soft so the user still gets the full result.
  try {
    if (
      GHL_WEBHOOK_URL &&
      !GHL_WEBHOOK_URL.includes("SWAP_IN")
    ) {
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "respace-affordability-calculator",
          tags: ["respace-buyer-pool", "affordability-calc"],
          metro: body.metro,
          annualIncome: body.annualIncome,
          monthlyDebts: body.monthlyDebts,
          downPayment: body.downPayment,
          soloMaxHomeValue: body.soloMaxHomeValue,
          coOwnerMaxHomeValue: body.coOwnerMaxHomeValue,
          estimatedMonthlyPayment: body.estimatedMonthlyPayment,
          gap: body.gap,
          submittedAt: new Date().toISOString(),
        }),
      });
    } else {
      console.warn("[affordability] webhook URL not configured");
    }
  } catch (err) {
    console.warn("[affordability] webhook forward failed", err);
  }

  return NextResponse.json({ ok: true });
}

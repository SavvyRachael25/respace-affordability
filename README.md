# reSpace Affordability + Co-Buyer Lead Tool

A single-flow buyer-facing tool that does three jobs:

1. **Stage 1 — Affordability calculator.** Buyer enters 4 financial inputs (FHA-clean: income, monthly debt, down payment, metro). Two-column comparison shows solo max home value vs co-owner full-property max at identical monthly payment, plus the gap.
2. **Stage 2 — Property gallery.** After email capture, the buyer sees real reSpace properties in their metro at their share level. Each card shows full property price, share-from price, suites available, and a CTA.
3. **Stage 3 — Per-property lead capture.** Clicking a property opens the full detail view with a lead form (name, email pre-filled, phone, optional notes). Submission routes to the reSpace broker pipeline with the buyer's full affordability profile attached.

## Development

```bash
npm install
npm run dev
# typecheck:
npm run typecheck
# production build:
npm run build
```

## Backend wiring (deferred)

Both API routes are currently stubbed:

- `POST /api/capture` — validates email, logs server-side. Will forward to GHL when `NEXT_PUBLIC_RESPACE_AFFORDABILITY_WEBHOOK` is set.
- `POST /api/lead` — validates name/email/phone/property, logs server-side, returns a fake `leadId`. Real GHL routing, broker notification, and Supabase persistence are deferred. Replace the body of `forwardLead()` in [src/app/api/lead/route.ts](src/app/api/lead/route.ts) when ready.

## Property data

Seed property list lives in [src/data/properties.json](src/data/properties.json). Swap to a live API by replacing [src/lib/respace/properties.ts](src/lib/respace/properties.ts) — same shape, same call sites.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_RESPACE_AFFORDABILITY_WEBHOOK` | GHL webhook for email-only opt-ins (Stage 1.5) |
| `NEXT_PUBLIC_RESPACE_LEAD_WEBHOOK` | GHL webhook for full per-property leads (Stage 3) |
| `NEXT_PUBLIC_RESPACE_HOLD_YOUR_SPACE_URL` | Hold Your Space reservation flow |
| `NEXT_PUBLIC_RESPACE_BUYER_POOL_URL` | Buyer pool signup |

Set in Vercel project Settings -> Environment Variables.

## Brand

Brand tokens (Clash Display, DM Sans, navy `#1A1A2E`, coral `#E8604C`, sand `#F5EFE6`, sage `#7C9A7E`) live in `RESPACE_THEME` inside [src/lib/affordability/config.ts](src/lib/affordability/config.ts). Sourced from brand.respace.co v1.5 and matched to the live reSpace site.

## Compliance

FHA-clean. Only financial inputs collected (income, monthly debts, down payment, metro). No protected-class fields. Required footer disclaimer runs on every state.

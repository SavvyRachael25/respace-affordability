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
- `POST /api/lead` — validates name/email/phone/property, builds a GHL-ready payload, logs it, returns a fake `leadId`. Replace the body of `forwardLead()` in [src/app/api/lead/route.ts](src/app/api/lead/route.ts) when ready.

### Broker flow (GHL → FUB)

reSpace brokers work in **Follow Up Boss (FUB)**, not GHL. The flow is:

```
/api/lead  →  GHL webhook (tags + custom fields)
              ↓ GHL→FUB sync (configured in GHL Integrations)
              FUB contact created with tags carried over
              ↓ FUB smart list / pond rules
              Broker picks up the lead
```

Tags are the contract FUB brokers filter on. The taxonomy lives in `buildGhlPayload()` in [src/app/api/lead/route.ts](src/app/api/lead/route.ts) — edit carefully, brokers' saved views depend on it. Current tags include:

- `respace-buyer-pool`, `respace-affordability-calc`, `respace-lead-submitted`
- `respace-suite-claimed` *(or `respace-property-interested` if no suite picked)*
- `respace-property-<slug>` — e.g. `respace-property-leschi-collection`
- `respace-suite-<id>` — e.g. `respace-suite-leschi-outlook-a`
- `respace-metro-<metro>` — e.g. `respace-metro-seattle-wa`
- `respace-fit-within-reach` or `respace-fit-stretch` — buyer can afford the picked suite or not
- `respace-utm-<source>` — friend-share leads tagged with `respace-utm-friend`

Custom fields prefixed `respace_*` carry the buyer's affordability profile (income, debts, down, solo/co-owner max, gap) so the broker sees the qualification context on the FUB contact card without leaving the app.

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

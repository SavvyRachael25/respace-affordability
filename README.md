# reSpace Affordability Calculator

A single-page tool that shows a buyer the gap between solo and co-homeownership affordability. Top-of-funnel lead capture into the reSpace buyer pool.

## Development

\`\`\`
npm install
npm run dev
\`\`\`

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_RESPACE_AFFORDABILITY_WEBHOOK` | GHL webhook URL that receives the captured email + computed result | placeholder |
| `NEXT_PUBLIC_RESPACE_HOLD_YOUR_SPACE_URL` | Hold Your Space \$250 refundable reservation flow | `https://respace.co/hold-your-space` |
| `NEXT_PUBLIC_RESPACE_BUYER_POOL_URL` | Buyer pool signup | `https://respace.co/buyer-pool` |

Set in Vercel project Settings -> Environment Variables.

## Compliance

This tool is FHA-clean. Only financial inputs are collected (income, monthly debts, down payment, target metro). No age, family size, marital status, employment type, or any protected-class signal. The footer disclaimer is mandatory and runs on every state.

See banned-terms verification in commit history.

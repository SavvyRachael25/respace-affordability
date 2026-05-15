# reSpace Affordability Tool: Broker Pitch

A talking-points doc for the broker call. Read it, screen-share it, or paraphrase from it. No em-dashes, no jargon, no fluff.

---

## The 30-second opener

> We just built you a lead machine.
>
> Every buyer who lands on respace.co and wonders "could I actually afford this?" now has a tool that answers the question with real math, shows them which suites in which properties they could co-own, and lets them tell us they want a conversation. When they hit that button, the lead comes to you within seconds, fully qualified, with the suite they picked, the property they picked, and a complete affordability profile attached. You don't have to chase. You don't have to qualify. You just call.
>
> And it works no matter what CRM you use.

---

## The "no matter what CRM you use" part

We know brokers don't all live in the same system. Some of you are on Follow Up Boss. Some on kvCORE. Some on Boomtown, Sierra, BoldTrail, Top Producer, Sisu, or your own thing. Some of you mostly run on email.

So the lead gets delivered three ways at once. You pick how you want to receive it:

**1. Email (works for everyone).** A clean, structured email lands in your inbox the moment the buyer submits. Plain English summary at the top, all qualification data below in a format any email-parser CRM can read. If you do nothing else, you can run your whole business off this email.

**2. Webhook into your CRM (if your CRM supports it).** Tell us your inbound webhook URL and we'll fire the same data straight into your CRM. New contact created with tags, custom fields, and source attribution.

**3. Native FUB sync (if you're on FUB).** Same tags + custom fields land directly on the contact card via the GHL→FUB integration.

All three carry the same data. All three carry the same tags. All three carry the same affordability profile. You don't pick one and lose the others. You can take the email AND get it in your CRM. Belt and suspenders.

---

## The email you'll get (regardless of CRM)

Here's what hits your inbox the moment a buyer submits interest. This is the universal artifact every broker gets:

```
Subject: New reSpace lead: Casey Park picked The Outlook A at The Leschi Collection

A new buyer just used the reSpace affordability calculator and picked
a specific suite. Here's everything you need to call them.

CONTACT
  Name: Casey Park
  Email: casey@example.com
  Phone: (206) 555-1234

PICK
  Property: The Leschi Collection
  Neighborhood: Leschi, Seattle
  Suite: The Outlook A
  Share price: $118,750

AFFORDABILITY
  Annual income: $120,000
  Monthly debts: $450
  Down payment: $25,000
  Solo max home value: $345,669
  Co-owner max home value: $1,382,678
  Monthly payment they can carry: $2,800
  Gap: $1,037,009 more home as a co-owner

FIT
  Within reach. Their solo max ($345,669) covers the share price
  ($118,750) with room.

CO-BUYER NOTES
  Open to a group match.

SOURCE
  reSpace affordability calculator
  UTM: utm_source=friend (came from someone's share link)
  Submitted: 2026-05-13 18:00:00 UTC
  Lead ID: lead_mp4bpnzz_tp6t7l

TAGS (for your CRM's filter views)
  respace-buyer-pool
  respace-affordability-calc
  respace-suite-picked
  respace-property-leschi-collection
  respace-suite-leschi-outlook-a
  respace-metro-seattle-wa
  respace-fit-within-reach
  respace-utm-friend

Promise made to buyer: a reSpace broker will reach out within
24 hours. Clock started 18:00 UTC.
```

You can read that on your phone in line at Starbucks. You can act on it without opening anything else.

---

## Tags are the universal contract

Every CRM lets you filter by tag. The tags above are the same in every CRM, every email, every webhook payload. That's the contract.

| Tag | What it means |
|---|---|
| `respace-affordability-calc` | They came through the calculator. Pre-qualified |
| `respace-suite-picked` | They picked a specific suite. Hot |
| `respace-property-leschi-collection` | They want The Leschi Collection |
| `respace-suite-leschi-outlook-a` | The specific suite they want |
| `respace-metro-seattle-wa` | Their market |
| `respace-fit-within-reach` | Suite price is inside their budget. Closer to ready |
| `respace-fit-stretch` | Suite is a reach. Financing conversation |
| `respace-utm-friend` | A friend sent them. Group buy is forming |

Build saved views on these. Examples:

- "Hot: within-reach picks this week"
- "The Grove leads"
- "Friend referrals (group-buy potential)"
- "Stretch leads (financing creativity needed)"
- "Bellevue market"

Works in FUB. Works in kvCORE. Works in Boomtown. Works in your email inbox with a label filter.

---

## Why these leads are different

Three reasons a respace-affordability lead beats a generic respace.co contact-form lead:

**Pre-qualified financially.** They ran their own numbers before they ever filled out a form. We know they can afford what they're asking about. No tire kickers. No "I'll have to ask my partner about budget."

**Suite-specific intent.** They didn't ask "tell me about your properties." They said "I want The Outlook A at The Leschi Collection." That's a hand raised in a room of options.

**Affordability profile attached.** You know their income, their debts, their down payment, their solo max, their gap. You call ready to talk financing structures, not ready to ask intake questions.

---

## Attribution: who gets credit

The part you care about. Here's how reSpace tracks the chain:

**Source → Broker → Close**

- Every lead carries `respace-affordability-calc` as a permanent source tag. It rides through the entire deal.
- You own the lead from the moment it's assigned, in whichever CRM you work in.
- When it closes, reSpace's marketing system (GHL is the source of truth) can report: this calculator generated X leads in March, Y closed, attributed to brokers A, B, C.
- You get full credit for the close. reSpace gets full visibility into marketing ROI. Nobody fights over who owned what.

**The marketing system is the source of truth for attribution, not any individual CRM.** This matters because brokers come and go, CRMs come and go, but the GHL record persists. If you switch from FUB to kvCORE next year, the attribution data is still intact.

**Friend-referral attribution.** When a buyer shares the calculator with a friend, the friend's lead carries `respace-utm-friend`. If both buy into the same property, you see the group forming in real time. One lead becomes two becomes four. You close the whole house.

---

## The growth loop

Co-homeownership has a structural advantage over single-family resale: every closed property has 4 buyers, not 1.

The affordability tool makes that explicit. After a buyer submits interest, the thank-you page invites them to send the calculator to anyone they'd want to co-own with. The share link carries the property AND the suite, so when the friend lands on the calc, runs their numbers, and picks a suite at the same property, you get the second lead with the friend-share tag.

You're not closing 1 deal. You're closing 4. And the calculator is doing the lifting on getting the other 3 in the door.

---

## FHA compliance, briefly

We collect four financial inputs only: income, monthly debts, down payment, target metro. Zero protected-class fields. Zero lifestyle questions. The FHA disclaimer renders on every state of the tool. Your liability surface is the same as any standard mortgage qualification conversation. We did the legal homework so you don't have to defend it on a call.

---

## What we need from each broker to make this real

Three answers per broker. No more.

1. **What CRM do you use?** FUB, kvCORE, Boomtown, Sierra, BoldTrail, Top Producer, Sisu, custom, or email-first?
2. **If you have a CRM webhook URL, can you share it?** If you don't, no problem. Email delivery still works. Just confirm which email address the lead should land at.
3. **Confirm 24-hour response SLA.** The tool promises buyers a broker reaches out within 24 hours. We need that promise honored on the broker side.

Once we know your stack, we configure the GHL routing so leads land where you actually work.

---

## The single ask of the call

Two yeses:

- **Confirm 24-hour broker response SLA** across all brokers
- **Each broker tells us their CRM + email by EOD** so we can set up routing

Once those are confirmed, marketing turns on the calculator on respace.co/buyers as a primary CTA, and the funnel starts.

---

## If they ask "what's this gonna cost us?"

The tool is built. The pipeline plumbing is built. The compliance is solid. The only ongoing cost is the broker time to respond inside 24 hours, which they should want anyway because these leads are pre-qualified and hot.

## If they ask "I don't use FUB / I don't use a CRM / I just use email"

Perfect. The email IS the lead. Structured, qualified, ready to call. You don't need anything else.

## If they ask "what if a buyer wants a property we don't have yet?"

The gallery filters to properties in their metro at their share level. If we don't have one, we capture them into a "notify me when one opens up" list so the lead doesn't die. They go into the buyer pool with the same affordability profile attached and we route them when supply hits.

## If they ask "what about the existing buyer pool / Hold Your Space funnel?"

Both still exist. The calculator is an additional top-of-funnel that pre-qualifies AND captures interest in specific suites. It feeds the same pool with better data on each lead. Hold Your Space ($250 refundable) still happens at the broker stage, after the conversation.

---

## One-line elevator if you get interrupted

> "It's a pre-qualified lead machine that drops suite-specific buyer interest into your inbox AND your CRM, whichever you use, inside 24 hours with full affordability data attached. You don't change how you work. We just feed you better leads."

# reSpace Affordability Tool: Broker Pitch

A talking-points doc for the broker call. Read it, screen-share it, or paraphrase from it. No em-dashes, no jargon, no fluff.

---

## The 30-second opener

> We just built you a lead machine.
>
> Every buyer who lands on respace.co and wonders "could I actually afford this?" now has a tool that answers the question with real math, shows them which suites in which properties they could co-own, and lets them tell us they want a conversation. When they hit that button, the lead lands on your desk inside Follow Up Boss within seconds, fully qualified, with the suite they picked, the property they picked, and a complete affordability profile attached. You don't have to chase. You don't have to qualify. You just call.

---

## The lead, the moment it lands

Open FUB. A new contact appears. Here's exactly what you see:

**Name, email, phone** — already validated. They typed it themselves.

**Tags** — these are the filter contract. Every saved view you build keys off these:

| Tag | What it means |
|---|---|
| `respace-affordability-calc` | They came through the calculator. Pre-qualified |
| `respace-suite-picked` | They picked a specific suite. Hot |
| `respace-property-leschi-collection` | They want The Leschi Collection |
| `respace-suite-leschi-outlook-a` | The specific suite they want |
| `respace-metro-seattle-wa` | Their market |
| `respace-fit-within-reach` | The suite they picked is inside their budget. Closer to ready |
| `respace-fit-stretch` | The suite they picked is a reach. Financing conversation |
| `respace-utm-friend` | A friend sent them. Group buy is forming |

**Custom fields** — qualification, already done:
- Annual income
- Monthly debts
- Down payment
- Solo max home value
- Co-owner max home value (the full property they could afford as 1/N)
- Monthly payment they can carry
- The gap between solo and co-owner (the "more home" number)

**Notes** — plain English summary at the top of the card so you can skim before opening fields:

> Pick: The Outlook A at The Leschi Collection ($118,750)
> Within reach. Solo max $345,669 vs share $118,750.
> Co-buyer notes: Open to a group match.

You see all of that before you dial. No discovery call needed to figure out where they are.

---

## How it works under the hood

The plumbing, in three sentences a broker actually wants to hear:

1. **Buyer fills the calc on respace.co.** Four financial inputs. They see what they could afford solo vs. as a co-owner. The gap is usually big enough to surprise them.
2. **They capture their email, browse properties, pick a suite, hit "Have a broker reach out about [The Outlook A]."** No claim language, no commitment energy. Just a conversation request.
3. **The lead fires into GHL with the tag taxonomy above, and GHL syncs it into FUB.** Tags carry over. Custom fields carry over. You see it in FUB within seconds.

You never have to log into GHL. You never have to learn a new system. You stay in FUB. The marketing layer just feeds you better leads.

---

## Why these leads are different

Three things make a respace-affordability lead worth more than a generic respace.co contact form lead:

**Pre-qualified financially.** They ran their own numbers. We know they can afford what they're asking about. No tire kickers. No "I'll have to ask my partner about budget."

**Suite-specific intent.** They didn't just ask about "your properties." They told us they want The Outlook A at The Leschi Collection. That's a hand raised in a room of options.

**Affordability profile attached.** You know their income, their debts, their down payment, their solo max, their gap. You can call ready to talk financing structures, not ready to ask intake questions.

---

## Attribution: who gets credit

This is the part you care about. Here's how reSpace tracks the chain:

**Source → Broker → Close**

- Every lead carries `respace-affordability-calc` as a permanent source tag. That tag never gets removed. It rides through the entire deal.
- FUB assigns the lead to a broker the moment it lands. You own it from second one.
- When it closes, FUB reports show both the broker who closed AND the source that brought it in.
- reSpace leadership can see: this calculator generated X leads in March, Y closed, attributed to brokers A, B, C.

You get full credit for the close. reSpace gets full visibility into which marketing channels are paying off. Nobody fights over who owned what.

**Friend-referral attribution gets even better.** When a buyer shares the calculator with a friend (which we make easy), the friend's lead gets tagged `respace-utm-friend`. If the friend buys into the same property as the first buyer, you see the group forming in real time. One lead becomes four. You close the whole house.

---

## The growth loop nobody talks about

Co-homeownership has a structural advantage over single-family resale: every closed property has 4 buyers, not 1.

The affordability tool makes that explicit. After a buyer submits interest in The Outlook A at The Leschi Collection, the thank-you page invites them to send the calculator to anyone they'd want to co-own with. The share link carries the property AND the suite, so when the friend lands on the calc, runs their numbers, and picks a suite at the same property, you get the second lead with `respace-utm-friend` on it.

You're not closing 1 deal. You're closing 4. And the calculator is doing the lifting on getting the other 3 in the door.

---

## FHA compliance, briefly

We collect four financial inputs only: income, monthly debts, down payment, target metro. Zero protected-class fields. Zero lifestyle questions. The FHA disclaimer renders on every state of the tool. Your liability surface is the same as any standard mortgage qualification conversation. We did the legal homework so you don't have to defend it on a call.

---

## What we need from brokers to make this real

1. **Confirm the FUB pipeline.** Which pipeline does an affordability-calc lead drop into? Which smart list or pond rule routes it to the right broker for that metro?
2. **Confirm custom field mapping.** The `respace_*` custom fields need to map to FUB custom fields. If they don't exist in FUB yet, your FUB admin needs to create them. We have the field list ready to hand over.
3. **Confirm response SLA.** The tool promises buyers a broker reaches out within 24 hours. We need someone owning that SLA on the broker side.

Once those three are settled, we flip a switch in GHL and the leads start flowing.

---

## The single ask of the call

Get a yes on:
- Confirm 24-hour broker response SLA
- Confirm FUB pipeline + custom field setup is a yes
- Confirm broker(s) ready to take Seattle metro leads first

Once those three are confirmed, marketing turns on the calculator on respace.co/buyers as a primary CTA, and the funnel starts.

---

## If they ask "what's this gonna cost us?"

The tool is built. The pipeline plumbing is built. The compliance is solid. The only ongoing cost is the broker time to respond to leads inside 24 hours, which they should want anyway because these leads are pre-qualified and ready.

---

## If they ask "what if a buyer wants a property we don't have yet?"

The gallery filters to properties in their metro at their share level. If we don't have one, we show a "we'll notify you when one opens up" capture so the lead doesn't die. They go into the buyer pool and we route them when supply hits.

---

## If they ask "what about the existing buyer pool / Hold Your Space funnel?"

Both still exist. The calculator is an additional top-of-funnel that pre-qualifies AND captures interest in specific suites. It feeds the same pool, with better data on each lead. Hold Your Space ($250 refundable) still happens at the broker stage, not before.

---

## One-line elevator if you get interrupted

> "It's a pre-qualified lead machine that drops suite-specific buyer interest into FUB inside 24 hours with full affordability data attached. You stay in FUB. Marketing handles the rest."

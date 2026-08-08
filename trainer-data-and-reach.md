# TOWES — Data & Reach Concept

How we count our numbers, what data we collect, and how the trainer contract makes it work.
(Companion to `trainer-approval-rules.md`.)

## The foundation: two audiences, two privacy rules
- **The individual end-user** (everyday MOWES user) → fiercely private. No accounts, no tracking, data stays on their phone. This is the brand promise and the moat.
- **The trainer** → a public professional who WANTS to be found. Being tracked is normal and welcome. We take control of the trainer account and its data.
- **The sacred line:** track the trainer all we want. NEVER track the individual end-user through the trainer. We count *actions* ("a program was loaded," "a card was tapped"), never *who* did them.

## Front door, not link list
MOWES must be where the user's **daily habit lives** (plan the week, daily push, load programs) — not just a page of links they tap once and leave. If MOWES is the front door, every trainer pours engaged daily users into it. If it's just a link list, the trainer takes the client and MOWES is forgettable. The "load a program into MOWES" feature is the turnstile that keeps users inside.

## Reach vs. paying subscribers — keep two columns
- **Reach / users** = everyone using MOWES (our own users + every client a trainer brings in). This is the growth/traction number for promo ("MOWES powers 5,000 weekly workouts").
- **Paying subscribers** = the **trainer** (small monthly fee later) + any users who tip/subscribe on their own.
- A trainer with 35 clients adds **35 to reach** and **1 to paying customers.** Don't mix the columns.
- A client only counts toward reach if they **actually use MOWES** (load the program in-app) — not if they just watch the trainer's YouTube.

## Two types of trainers — what data we get

### Type 1 — Builds inside MOWES/TOWES (program lives in our app)
Richest, most trustworthy data, all anonymous:
- 📥 Program loads ("picked up 35 times") = real reach
- 👆 Card taps in the Trainers hub
- 🔁 Rough anonymous active-follow count
- Plus full **trainer-side** info (what they built, share-links made, reach) — fair game, they're our tracked customer.
- **Catch:** to tally these ourselves we need one small **anonymous counter** (counts events, never people). One bit of infrastructure to add later. Keeps the promise; gives numbers we can trust.

### Type 2 — Uses their OWN app/platform, just listed in our "yellow pages"
The action leaves MOWES when the user taps out, so:
- ➡️ **Outbound traffic we send** — "MOWES sent you 120 visitors," measured via the utm tags already on their links (trainer sees it in their own analytics = proof of value).
- ❌ We can't see past the click (views, sign-ups, sales on their platform) on our own.
- ✅ **Fill the gap with the contract:** trainer must report their MOWES-referred numbers back to us.

## The contract clause (mandatory)
**Listing on TOWES requires the trainer to agree to share all data we both need — for their side and ours.** They get reach and proof-of-value; we get the numbers to add up total reach and to bill/feature fairly. Trainers won't blink, because the data *proves* MOWES is working for them.

Suggested application line: *"By listing, you agree to share your MOWES-referred traffic and results with us."*

## Adding it all up
- **Type 1** → we count directly (anonymous loads/taps).
- **Type 2** → we count the traffic we send (clicks/utm) + trainer-reported conversions.
- Either way we reach a **total reach number** — the contract fills what we can't see.

---
_Future infrastructure decision: a lightweight anonymous event counter (loads/taps) so our numbers
are self-verified, not trainer's-word-only. Aggregate + anonymous = promise stays intact._

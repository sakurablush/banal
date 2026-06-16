# The Banal Mindset

This document defines how Banal speaks — in the UI, in meta tags, in section headers, and in anything a visitor reads before they click a tool.

Read it before you write copy. If a sentence fails this test, delete it.

SPIRIT.md explains what we believe. This document explains how we sound.

---

## Who this is for

Banal is for **professional builders who fund their own stack**:

- Freelancers and consultants between contracts
- Indie hackers shipping on nights and weekends
- Engineers who left — or never had — a team procurement budget
- Anyone doing serious application work while the invoice is personal

Our reader is competent. They already know the industry. They do not need sympathy performance or poverty tourism.

---

## The cost reality we take seriously

A twenty-dollar monthly subscription is not the real line item for professional AI-assisted development.

For sustained work on real applications — iteration, debugging, refactors, agents, image and code pipelines — **token and inference spend often runs into hundreds of dollars per month**. Seats, APIs, and overlapping tools stack on top of that.

Meanwhile, many organizations approve enterprise budgets for teams but **block individual engineers on small license requests** that do not reflect how the work is actually done. Builders who ship anyway pay out of pocket — on side projects, on client work, on the stack they need to stay current.

Banal exists in that gap. Not as charity. As **reference infrastructure**.

---

## What Banal is — and is not

**Banal is:**

- A working index and reference — something you keep open like documentation
- Exact counts from curated data, not marketing round numbers
- Access types and caveats on every entry before you click
- Peer-to-peer honesty: what works, what limits exist, what signup means

**Banal is not:**

- A joke about being broke
- "Here poor people, here are tools" branding
- Inflated claims ("world's largest", "all free", "zero gatekeeping")
- Copy that pretends subscription price is the whole problem

---

## Tone rules (non-negotiable for public copy)

1. **Peer to peer.** Write to a professional who pays their own inference bill.
2. **Exact numbers.** `{total}`, `{ai}`, `{dev}` from data — never hand-waved "+" marketing counts.
3. **Limits on the card.** Freemium is labeled freemium. Signup is labeled signup. No hidden asterisks.
4. **Dignity by default.** No shame language. No condescension. Assume capability; remove friction.
5. **No charity voice.** This reads like a serious reference, not a donation landing page.
6. **No fake relatability.** Do not anchor copy to a trivial dollar amount when the real cost is token volume and procurement failure.

---

## The voice check

Before shipping UI copy, meta descriptions, or section headers, ask:

> Would a senior engineer who spends their own money on tokens and side-project APIs **trust** this sentence on a deadline night?

> Does it sound like **documentation** or like **marketing**?

If it sounds like marketing, sympathy theater, or a joke about money — rewrite it.

---

## For contributors

- Page copy lives in `src/i18n.ts` (EN source of truth + hand-crafted JA).
- Counts interpolate via `src/data/site-stats.ts` — do not hardcode totals in prose.
- Tool caveats live on cards in `src/data/zero-key-tools.ts` — keep them specific.
- When in doubt, read SPIRIT.md for ethics and this file for voice.

---

_This document can be copied and adapted in any fork. Its only job is to keep Banal sounding like what it is: a serious reference for builders who pay their own freight._

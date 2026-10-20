# C4-ADDENDUM-1 — Prize-Vault Economics, ARV Disclosure & Arena Coin Classification

<!-- ============================================================= -->
<!-- INSERT FOR: C4 — Attorney-Brief Assembler                      -->
<!-- Paste the QUESTION SET sections below into C4 Task item 2      -->
<!-- (the ordered question set), after the Ecosystem-B questions.   -->
<!-- Paste the RETURN-DATA additions into C4 Task item 3.           -->
<!-- ============================================================= -->

---
## SHARED CONTEXT PREAMBLE
Identical to every agent doc — the five walled ecosystems (A–E), the Firewall Doctrine (*Eligibility ≠ Entitlement; marketing is a regulated surface; per-jurisdiction switches*), left-to-right activation by regulatory weight.

**This is not legal advice.** This addendum describes structures to build and questions to ask a licensed attorney — never a legal green light.
---

## Why this addendum exists (context for counsel)
The prize system is designed around a structural asymmetry:

1. **Procurement wedge** — prizes are sourced at 30–60% of MSRP (overstock, liquidation, closeout, bulk) or at $0 (sponsor in-kind). All prize value is *displayed and disclosed* at approximate retail value (ARV / MSRP basis); all cost is incurred at acquisition price or not at all.
2. **Paper vault / just-in-time fulfillment** — the displayed prize catalog ("the Vault") is marketing surface, not held inventory and not an accrued obligation. Under the Firewall Doctrine, no player is *entitled* to anything until a discrete win event occurs; only at that moment is a unit purchased, drop-shipped, or drawn from a sponsor agreement. The Vault may therefore display large aggregate ARV while the company carries approximately zero prize liability.
3. **Displayed-to-redeemed ratio as a tunable lever** — witnessed-win density is held constant for credibility while per-capita win odds decay as the player base grows; total displayed value can vastly exceed total redeemed value at all times.
4. **Endgame** — sponsors pay cash placement fees to appear in the Vault *and* supply redeemed units; the prize line becomes revenue-positive.

Counsel is asked to validate that this structure is lawful as designed, and to mark every point where wording, disclosure, or accounting treatment determines the outcome.

---

## QUESTION SET — insert into C4 §2 after the Ecosystem-B questions

### Q-V1. Promotional-liability & accrual treatment of the paper vault
- Does displaying a prize catalog with no held inventory and no pre-committed winners create any *legal* obligation or accrued liability before a win event, in any state? Confirm that the eligibility-≠-entitlement structure (attach C1 rules + official-rules draft) keeps the Vault classified as advertising/promotion rather than a promise.
- Required accounting treatment: at what moment does a prize become a booked liability (win event? notification? acceptance?), and does GAAP promotional-liability treatment differ from the legal analysis in any way that affects disclosures to backers/investors?
- Is a **displayed-to-redeemed ratio** itself ever a problem — i.e., is there any doctrine (state UDAP, FTC Section 5) under which displaying far more aggregate value than is ever awarded becomes deceptive even if every displayed item is individually fulfillable and official rules disclose odds/quantities?

### Q-V2. Fulfillability floor & phantom-prize exposure
- Proposed internal gate: **nothing enters the Vault without a `fulfillment.json`** — a live supplier agreement, in-stock verification, or executed sponsor in-kind commitment. Confirm this satisfies the deceptive-promotion standard (FTC Section 5; state AG enforcement patterns on prize promotions), and specify what evidence retention counsel wants per displayed item.
- What are the notification, delivery-window, and prize-substitution obligations after a win event, per state?

### Q-V3. ARV / MSRP disclosure norms
- Confirm MSRP is an acceptable basis for stated **Approximate Retail Value** in every target state even where acquisition cost is far lower; identify any state requiring a different basis, disclosure of acquisition cost, or specific ARV-accuracy standards.
- Validate standard **substitution-clause** language ("a prize of equal or greater value may be substituted at sponsor's discretion") as the mechanism that makes just-in-time fulfillment safe when a displayed SKU becomes unavailable. Provide the exact clause counsel wants in the official rules.
- Confirm the firewall's **no-cash-equivalence line**: no copy anywhere (UI, lore, Discord, TikTok) may state or imply that any prize, vault position, or eligibility converts to cash or has cash value. Ask counsel to red-line the boundary phrases (what wording crosses it).
- Per-state ARV thresholds: at what displayed or awarded value do registration/bonding obligations attach for no-purchase-necessary skill promotions (extends the existing Ecosystem-B threshold question to *displayed* vs. *awarded* value — which one triggers)?

### Q-V4. Arena Coin classification — flagged as a firewall breach risk
Current concept (Master Context Doc): earned participation currency redeemable for discounts, rewards, exclusive competitions, partner offers. **Internal position: as specified, this punctures the paper-vault structure** — earned redeemable credit is an accruing obligation and imports gift-card, escheatment/unclaimed-property, and potentially money-transmission analysis. Ask counsel:
- At what point does an earned, redeemable in-app currency become (a) a stored-value/gift-card instrument, (b) unclaimed property subject to escheatment, (c) a money-transmission trigger?
- Does redemption **for discounts only** (never goods, never cash) change the classification materially?
- Validate the proposed safe redesign: Arena Coin as a **pure Ecosystem-A status/cosmetic currency** that gates *eligibility* (unlocks, access, rank insignia) and is never redeemable, never transferable, never convertible. Confirm this carries no gift-card/escheatment/MSB surface and does not itself create a prize-law surface when it gates entry to prize-eligible events (interaction with the "consideration" element — see Q-V5).
- If any redeemable form survives, what expiration, dormancy, and disclosure regime applies per state?

### Q-V5. Crowdfunding campaign — consideration firewall
The launch cohort is seeded via Kickstarter-style crowdfunding. **Internal rule: backers purchase founding status, cosmetics, and lore access — never prize eligibility.** Ask counsel:
- Confirm that backer rewards as scoped create no consideration-for-prize-eligibility link (which would constitute prize + chance/skill + consideration in stricter states, i.e., lottery or unregistered paid contest exposure before any Ecosystem-C clearance).
- Red-line the campaign page: which phrases, reward-tier structures, or stretch goals would create the link (e.g., "backers get early access to prize tournaments"), and what disclaimer language must appear.
- Does the *timing* matter — if backers later become players who win prizes under generally available free-entry rules, is the earlier payment ever recharacterized as consideration?

---

## RETURN-DATA ADDITIONS — insert into C4 §3 (cleared-states format)
Extend the counsel return schema with per-state fields:
- `arv_basis_ok: MSRP | other(specify)`
- `displayed_value_trigger: displayed | awarded | none` + threshold amount
- `substitution_clause_required_text: string`
- `coin_status_only_cleared: bool` / `coin_redeemable_regime: none | giftcard | msb | prohibited`
- `crowdfund_consideration_risk: none | conditional(notes) | prohibited_phrasing(list)`

These load directly into C2's policy store alongside the existing cleared-states data; the Vault display service and Arena Coin feature flags read them as per-jurisdiction switches.

---

## Done-Criteria (for this addendum)
- Every question above appears in the assembled BRIEF.md with its evidence attachment (C1 rules, official-rules draft, `fulfillment.json` spec, Arena Coin spec, crowdfund page draft).
- Counsel's answers map 1:1 into the extended C2 schema fields above.
- The Arena Coin question is answered **before** any earn/redeem mechanic ships, and the crowdfund question **before** the campaign page goes public.

## Handoff
- Q-V1–V3 answers gate the Vault display service and official-rules copy (feeds C1 marketing-governance rules and the R4 Prize Chest copy).
- Q-V4 answer gates the Arena Coin design (Ecosystem A redesign vs. deferred redeemable form).
- Q-V5 answer gates the crowdfunding campaign launch.

---

## STATUS BLOCK — paste back to command center when merged into C4

```
TASK: C4-ADDENDUM-1
STATUS: [MERGED | BLOCKED | PARTIAL]
OUTPUTS PRODUCED:
  - <BRIEF.md sections added; cleared-states-format fields added>
DECISIONS MADE THAT COMMAND CENTER SHOULD KNOW:
  - <e.g. Arena Coin scoped to status-only pending counsel>
OPEN QUESTIONS:
  - <anything needing a human ruling>
```

<!-- =================== END INSERT: C4-ADDENDUM-1 =================== -->

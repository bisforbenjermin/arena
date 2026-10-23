# HANDOFF — Bow Hunt stakes (prizes y/n)

Opened: 261023 | Blocks: build/bow-hunt (P1→P6)

## Question
Does Bow Hunt: Thanksgiving ship with prizes/sponsors, or leaderboard only?

The six-packet spec is build-ready for leaderboard-only. Prizes change the surface area: client-side determinism is no longer sufficient — a seed-serving + score-verifying server becomes mandatory, and skill-contest law varies by state.

## Options, with the undo cost of each

- **A. Leaderboard only (no prizes, no sponsors).** Undo cost: hours. Ship the current spec as-is. If prizes come later, add a P7 server packet and a legal pass; replay files are already server-verifiable, so the migration is additive.
- **B. Prizes, server-verified.** Undo cost: weeks. Requires: (i) server-issued seeds (invalidates `?seed=` default), (ii) server-run `runReplay` on submission, (iii) C2 jurisdiction coverage per state, (iv) CP-0 solvency gate math applied to the prize pool, (v) GTM-2 broadcast–prize decoupling honored in copy.
- **C. Sponsored prizes (sponsor-funded, not operator-funded).** Undo cost: weeks. Same server + legal lift as B. CP-0 is lighter (operator isn't the bank) but CREDIT-1 two-rail still applies if payouts touch Arena Coin.

## Rulings this collides with
- **CP-0** solvency gate — any operator-funded prize pool
- **GTM-2** broadcast–prize decoupling — framing of prizes in marketing
- **CREDIT-1** two-rail — Arena Coin vs cash rail if payouts route through credits
- **C2** jurisdiction (spec, not ruled) — per-state skill-contest law
- **AUD-1** investor audience — prize story affects pitch

## Recommendation (PROPOSED)
**A for v1 launch (Thanksgiving, Nov 26).** Five weeks is too short to stand up a prize server + legal pass without compromising the game itself. Ship leaderboard-only, prove the replay-verification stack in production, then add P7 server + prize layer for a v2 if the numbers justify it. The replay files make this a one-way-door-free decision.

If prizes must ship v1, pick C over B — sponsor-funded shifts the solvency math off CP-0.

## Blocked until ruled
- Saving `bow-hunt-packets.md` to `specs/` as the frozen build target
- Launching the builder agent on `build/bow-hunt` for P1
- Resolving touch-control call (#4) — downstream of P6, orthogonal to this

## Not blocked
- Writing this handoff ✓ (done)
- Capsule drift (already regenerated 261023-1)

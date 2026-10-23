# Bow Hunt: Thanksgiving

Duck Hunt–style turkey shoot with a bow, plus a free-entry daily prize contest where players pick a sponsor's pool. Built from the build packets (`../specs/GAME-01_bow_hunt_thanksgiving.md` covers P1–P6; the contest packets C1–C7 came from the same session). Status and open rulings: `../arcade/README.md`.

## Play

- **Aim:** press anywhere, drag back like a bowstring and release. The arrow flies opposite the drag.
- **Power:** builds with hold time. Turkeys fly seeded paths, so lead them.
- **Rounds:** five rounds of five waves, two turkeys per wave, three arrows per wave. Miss a round's quota (6, 6, 7, 8, 9 hits) and the hunt ends.

## Commands

```
npm install
npm test             # 61 tests: engine vectors, replay, contest rules, store, APIs, UI
npm run dev          # free play at /?view=free, contest at /, admin at /?view=admin
npm run dev:api      # local API on :8787 with on-disk PGlite (admin token: dev-admin)
npm run verify -- fixtures/replay-bot.json fixtures/replay-bot.expected.json
```

## Deploy (after the stakes ruling and the legal review)

1. Create the Vercel project and add Postgres (Neon) from the Vercel Marketplace.
2. Set `DATABASE_URL`, `SEED_SECRET` and `ADMIN_TOKEN`. Use long random secrets and never commit them.
3. Run `DATABASE_URL=… npm run db:migrate` once, then deploy.
4. Open `/?view=admin`, create tomorrow's pools, and play `/` on a phone.

## Before the first prize day

- **Official Rules:** counsel writes them. Swap them into `public/rules.html` and `ELIGIBILITY_TEXT` in `src/contest/constants.ts`.
- **Freeze the engine:** scores are recomputed from replays with the current code, so a constant change mid-contest breaks past replays.
- **Review load:** every award is watched and approved in the admin console before it can be claimed. Reviews per day = pools × prize ranks.
- **Fulfillment:** prizes go out by hand to the claim email.
- **Abuse:** there's no rate limiting or CAPTCHA, so enforce one prize per person at claim time.
- **Name and art:** the art is primitive shapes. Keep clear of Duck Hunt's name and look.

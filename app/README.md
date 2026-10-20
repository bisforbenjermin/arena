# Arena — PWA Shell (F3)

**Framework:** Next.js 14 (App Router, TypeScript) — STACK-1  
**Auth:** Supabase Auth (`@supabase/ssr`)  
**PWA:** `@ducanh2912/next-pwa` + Workbox  
**Hosting:** Cloudflare Pages  

## Setup

```bash
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Routes

| Route | State | Notes |
|---|---|---|
| `/signin` | Sign-in | Magic link via Supabase Auth |
| `/auth/callback` | — | Exchanges OTP code for session |
| `/onboarding` | New user | Collect handle + home region |
| `/` | Check-in | Geofence or QR; redirects to `/lobby` on pass |
| `/lobby` | In-lobby | R1 mounts into `#arena-runtime` |

## How check-in works

Both paths call `checkEligibility()` in `src/lib/eligibility.ts`:

1. **Geofence** — browser Geolocation; player must be within 100 m of an active venue.
2. **QR fallback** — player types the code from the venue tablet; verified server-side via `/api/checkin`. QR is the trust anchor (GPS is spoofable).

## How to add a gate

Open `src/lib/eligibility.ts` and push a function to `GATES`:

```typescript
const GATES: Gate[] = [
  geofenceOrQrGate,
  jurisdictionGate,
  myNewGate,       // ← add here
];

async function myNewGate(req: EligibilityRequest): Promise<EligibilityResult> {
  if (/* blocked */) return { allowed: false, reason: 'my-reason' };
  return { allowed: true, reason: 'my-gate-passed' };
}
```

Gates run in order; first denial short-circuits. No other file changes needed.

## Game bundle pre-cache (SW)

`worker/index.ts` is merged into the generated `public/sw.js` by next-pwa at build time.  
R1 warms bundles before a round starts:

```typescript
navigator.serviceWorker.controller?.postMessage({
  type: 'CACHE_GAME_BUNDLE',
  url: 'https://r2.example.com/games/precision-tap/bundle.js',
});
```

Bundles are cached under `arena-game-bundles-v1`.

## Icons

PWA installation requires icon files. Generate and place:

- `public/icons/icon-192.png` (192×192)
- `public/icons/icon-512.png` (512×512, also used as maskable)

Use crimson `#E0103A` background per BRAND-2.

## Jurisdiction gate

`jurisdictionGate` in `src/lib/eligibility.ts` is a stub returning `allowed: true`.  
C2 replaces its body to implement per-state feature switches without touching any caller.

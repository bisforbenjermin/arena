# STACK-1 — Frontend Framework: Next.js
Ruled: 2026-10-20 | Reversibility: EXPENSIVE | Undo cost: rewrite /app/ shell (~1–2 days) | Confidence: HIGH

## Ruling
Frontend framework for the F3 PWA shell is Next.js (App Router, TypeScript). PWA via @ducanh2912/next-pwa + Workbox. Auth via Supabase Auth (@supabase/ssr). Hosted on Cloudflare Pages.

## Why
Founder chose Next.js. Largest ecosystem; React hiring signal. Auth provider confirmed as Supabase Auth by the F3 spec (tech baseline).

## Downstream
F3 scaffolding, R1 (mounts inside this shell), all frontend work.

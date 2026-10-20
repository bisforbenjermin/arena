// F3 — Eligibility-gating layer
// checkEligibility composes gates in order; first denial short-circuits.
// To add a gate: write a function matching Gate and push it to GATES.

export interface EligibilityRequest {
  playerId: string;
  action: string;
  location?: GeolocationCoordinates;
  qrToken?: string;
}

export interface EligibilityResult {
  allowed: boolean;
  reason: string;
}

export type Gate = (req: EligibilityRequest) => Promise<EligibilityResult>;

// ─── GATE REGISTRY ────────────────────────────────────────────────────────────
// Add a new gate by pushing a Gate function here. No other file changes needed.

const GATES: Gate[] = [
  geofenceOrQrGate,
  jurisdictionGate,
];

export async function checkEligibility(
  req: EligibilityRequest,
): Promise<EligibilityResult> {
  for (const gate of GATES) {
    const result = await gate(req);
    if (!result.allowed) return result;
  }
  return { allowed: true, reason: 'all-gates-passed' };
}

// ─── VENUE GATE (geofence + QR fallback) ──────────────────────────────────────
// QR is the trust anchor — GPS is spoofable. If a QR token is present, skip GPS.

const VENUE_RADIUS_M = 100;

async function geofenceOrQrGate(req: EligibilityRequest): Promise<EligibilityResult> {
  if (req.qrToken) {
    return verifyQrToken(req.qrToken, req.playerId);
  }

  if (!req.location) {
    return { allowed: false, reason: 'location-required' };
  }

  const venue = await getNearestVenue(req.location);
  if (!venue) {
    return { allowed: false, reason: 'no-venue-nearby' };
  }

  const dist = haversineMetres(req.location, venue);
  if (dist > VENUE_RADIUS_M) {
    return {
      allowed: false,
      reason: `outside-venue-radius:${Math.round(dist)}m`,
    };
  }

  return { allowed: true, reason: `geofence-pass:${venue.id}` };
}

// ─── JURISDICTION GATE (stub — C2 fills this) ─────────────────────────────────
// C2 replaces this function body without touching checkEligibility or any caller.
// Signature must stay: (req: EligibilityRequest) => Promise<EligibilityResult>.

async function jurisdictionGate(req: EligibilityRequest): Promise<EligibilityResult> {
  void req; // C2: remove this line and implement per-jurisdiction logic here.
  return { allowed: true, reason: 'jurisdiction-stub' };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

interface Venue {
  id: string;
  lat: number;
  lng: number;
}

async function getNearestVenue(loc: GeolocationCoordinates): Promise<Venue | null> {
  // TODO: query Supabase regions/venues table (F2) for the nearest active venue.
  void loc;
  return null;
}

async function verifyQrToken(
  token: string,
  playerId: string,
): Promise<EligibilityResult> {
  // TODO: POST to /api/checkin — Supabase Edge Function verifies the signed token
  // and records the check-in row. Returns allowed/reason from the response.
  const res = await fetch('/api/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, playerId }),
  });
  if (!res.ok) return { allowed: false, reason: 'qr-verify-failed' };
  return { allowed: true, reason: 'qr-pass' };
}

function haversineMetres(
  a: GeolocationCoordinates,
  b: { lat: number; lng: number },
): number {
  const R = 6_371_000;
  const φ1 = (a.latitude * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.latitude) * Math.PI) / 180;
  const Δλ = ((b.lng - a.longitude) * Math.PI) / 180;
  const h =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

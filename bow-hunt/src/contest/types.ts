export type Prize = { id: string; rank: number; description: string; valueCents: number; fundedBy: string };
export type Pool = { id: string; day: string; title: string; sponsorName: string; prizes: Prize[]; entrants: number };
export type EntryStatus = 'ok' | 'rejected';
export type EntryRow = { entryId: string; playerId: string; displayName: string; score: number; shotsFired: number; createdAt: number; status: EntryStatus };
export type Ranked = EntryRow & { rank: number };
export type AwardPlan = { prizeId: string; entryId: string; playerId: string };

# F1 — GameModule Contract: Why & Conformance Guide
The Arcade Realm · frozen after F1

---

## Why determinism is the load-bearing idea

Every design decision in the contract flows from one requirement: **given the
same seed and the same sequence of input events, the game must produce the
same score on any device, at any time, in any replay context.**

This sounds like a minor technical nicety. It is not. It is the foundation of
three separate system properties.

**1. Anti-cheat via replay verification.**
After every real round, the Tournament Runtime (R1) runs a headless replay:
it feeds the submitted `GameEvent[]` back into a fresh module instance with
the same `seed` and checks that the resulting `rawScore` matches what the
player submitted. If they differ, the round is flagged automatically — no
manual review required, no heuristic needed. An attacker who submits a
manipulated score cannot fabricate a consistent event log that produces that
score without also replaying the events correctly, which would produce the
correct score instead. Determinism makes cheating self-defeating.

**2. Fairness via shared instance.**
The same `RoundConfig` (same `seed`, same `speedMultiplier`) is issued to
all players in a round bracket. Because the game is deterministic, every
player faces mathematically identical obstacle layouts, timing patterns, and
random sequences. Skill is the only variable. This is the fairness guarantee
that makes the platform a skill contest rather than a lottery — which is also
the legal distinction that keeps the platform out of sweepstakes law in most
jurisdictions.

**3. Reproducible bot-testing and Factory QA.**
The Game Factory (G-chain) generates candidate modules and must verify them
before promoting them to the live pool. Determinism means a bot can replay a
fixed seed+events pair and compare scores across module versions — if a score
changes after a "cosmetic" refactor, the refactor was not cosmetic. This makes
regression testing tractable at scale without human play-testers.

---

## What the rules actually prevent

| Rule | What it prevents |
|---|---|
| No `Math.random()` — use `RoundConfig.prng` | Different PRNG state on replay → different random sequence → different score |
| No `Date.now()` in score paths | Wall-clock drift across devices/replays → non-reproducible timing |
| No external state (localStorage, network) | Ambient data changing between real round and headless replay |
| Physics driven by `GameEvent.t`, not wall clock | Frame-rate differences across devices producing different simulation outcomes |
| `scoringEnvelope` declared in `GameMeta` | Cold-start normalization needs a declared range; without it, provisional percentiles are uncalibrated |

---

## Minimal conforming stub

This stub satisfies the full contract. Use it as a starting point or as a
compliance checklist when reviewing a generated module.

```typescript
import type {
  GameModule, GameMeta, RoundConfig, RoundResult, GameEvent
} from './game-module';

// provenance.json must accompany every module (zero-IP rule).
// { "id": "...", "slug": "tap-counter-v1", "generatedBy": "human",
//   "license": "MIT", "assets": [] }

export class TapCounterGame implements GameModule {
  readonly meta: GameMeta = {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'tap-counter-v1',
    title: 'Tap Counter',
    controlScheme: 'tap',
    durationSeconds: 30,
    difficultyCurve: 'flat',
    themeTags: ['reflex'],
    generatedBy: 'human',
    scoringDirection: 'desc',
    scoringEnvelope: { min: 0, max: 200 },
  };

  private config: RoundConfig | null = null;
  private container: HTMLElement | null = null;
  private scoreCb: ((r: RoundResult) => void) | null = null;
  private events: GameEvent[] = [];
  private rawScore = 0;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private startTime = 0;
  private mounted = false;

  mount(container: HTMLElement, config: RoundConfig): void {
    if (this.mounted) throw new Error('Already mounted — call destroy() first');
    this.container = container;
    this.config = config;
    this.events = [];
    this.rawScore = 0;
    this.mounted = true;
    // Render initial UI (no timers started yet)
    container.innerHTML = '<button id="tap-btn" style="width:100%;height:100%">TAP</button>';
  }

  onScore(cb: (result: RoundResult) => void): void {
    this.scoreCb = cb;
  }

  start(): void {
    if (!this.container || !this.config) throw new Error('Not mounted');
    this.startTime = performance.now();

    const btn = this.container.querySelector('#tap-btn')!;
    btn.addEventListener('pointerdown', this.handleTap);

    // End the round after durationSeconds
    this.timerId = setTimeout(() => this.endRound(), this.meta.durationSeconds * 1000);
  }

  private handleTap = (e: Event): void => {
    const pe = e as PointerEvent;
    const rect = this.container!.getBoundingClientRect();
    const event: GameEvent = {
      t: performance.now() - this.startTime,
      type: 'tap',
      x: (pe.clientX - rect.left) / rect.width,
      y: (pe.clientY - rect.top) / rect.height,
    };
    this.events.push(event);
    this.rawScore += 1; // 1 point per tap — deterministic, no PRNG needed here
  };

  private endRound(): void {
    this.scoreCb?.({ rawScore: this.rawScore, events: this.events });
  }

  destroy(): void {
    if (this.timerId !== null) { clearTimeout(this.timerId); this.timerId = null; }
    if (this.container) {
      const btn = this.container.querySelector('#tap-btn');
      btn?.removeEventListener('pointerdown', this.handleTap);
      this.container.innerHTML = '';
      this.container = null;
    }
    this.config = null;
    this.scoreCb = null;
    this.events = [];
    this.mounted = false;
  }
}
```

### Conformance checklist

Before submitting a module for Factory review, verify every item:

- [ ] `GameMeta.id` is a UUID v4, unique in the pool
- [ ] `GameMeta.durationSeconds` is in [25, 60]
- [ ] `GameMeta.scoringEnvelope` reflects the actual achievable rawScore range
- [ ] `provenance.json` exists alongside the module (zero-IP rule)
- [ ] No `Math.random()` anywhere in the score path
- [ ] No `Date.now()` / `performance.now()` used as a score input
- [ ] All timers cancelled in `destroy()`
- [ ] All event listeners removed in `destroy()`
- [ ] `container.innerHTML` cleared (or renderer destroyed) in `destroy()`
- [ ] `destroy()` is idempotent (safe to call twice)
- [ ] `destroy()` handles the case where `start()` was never called
- [ ] Headless replay: same seed + same events = same rawScore (verified by R1)
- [ ] 100-cycle memory test passes flat (verified by Factory harness)

---

## Files in this contract

| File | Purpose |
|---|---|
| `game-module.ts` | `GameModule` interface + `RoundConfig`, `GameEvent`, `RoundResult`, `GameMeta` |
| `scoring.ts` | `NormalizerFn` contract + cold-start rule + `NormalizerRegistry` |
| `README.md` | This file — rationale + conformance guide |

**Downstream consumers of this contract:** F4 (reference games), G3+ (Factory generators), R1 (runtime mount/start/destroy), R2 (implements `NormalizerFn`). Any change to these interfaces after freeze requires explicit re-notification to all four chains.

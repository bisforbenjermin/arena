# GameModule Contract — Why & Conforming Stub

## Why this contract exists

### Determinism (PR-1, PR-2)
A score is only trustworthy if it can be reproduced. Given the same seed and the same input log, the sim must produce the same score on any device, in any environment.

**A single PRNG.** sfc32, seeded from `RoundConfig.seed`. The runtime injects the factory; games call `prngFactory()` to get the seeded function. `Math.random()`, `Date.now()`, and `performance.now()` are banned everywhere in game code. G2 rejects any bundle containing these strings at compile time.

**A single clock.** The runtime owns the loop and calls `tick(dt)` at a constant 1/60s. Games never implement their own loops or read wall-clock time. `GameEvent` timestamps are in sim ticks. A game that looks at the clock will silently produce different scores on a slow device — exactly where disputed scores originate.

### Server-authoritative scoring (PR-3)
A client-reported `rawScore` is always a CLAIM. The server replays the `GameEvent` log through a fresh headless sim instance and the replayed score is authoritative. This is only possible if sim runs without a browser. The TypeScript types enforce this structurally: `GameSim` receives no DOM types. A sim that references DOM APIs will not compile under Node.

### Distribution integrity (PR-4, PR-5)
Percentile distributions are keyed `(gameId, gameVersion)`. A balance change requires a `gameVersion` bump, which starts a fresh distribution. Silently re-baselining historical percentiles — because percentile drives rank, and rank is the eligibility surface — is the exact failure mode PR-4 prevents.

A new game is `NON-RANKING` until it has 200 real scores across 30 distinct players. The normalizer return type makes this explicit: there is no magic `-1` or `null`. Callers must handle both branches.

---

## Minimal conforming stub

```typescript
import type {
  GameModule, GameSim, GameView,
  RoundConfig, PrngFactory, GameEvent,
} from './game-module';

class StubSim implements GameSim {
  private score = 0;
  private log: GameEvent[] = [];
  private rand!: () => number;
  private currentTick = 0;

  init(config: RoundConfig, prngFactory: PrngFactory): void {
    this.score = 0;
    this.log = [];
    this.currentTick = 0;
    this.rand = prngFactory();          // PR-1: call factory once, store result
    void config;                        // seed already consumed by factory
  }

  tick(_dt: number): void {
    // PR-2: _dt is always 1/60 — not a wall-clock measurement. Do not use for timing.
    // PR-1: use this.rand(), never Math.random()
    this.score += Math.floor(this.rand() * 10);
    this.currentTick++;
  }

  getScore(): number { return this.score; }
  getEventLog(): readonly GameEvent[] { return this.log; }

  destroy(): void {
    this.log = [];
    // Release all references. No intervals or timeouts to clear in this stub.
  }
}

class StubView implements GameView {
  private sim!: Readonly<GameSim>;
  private scoreCb?: (raw: number, events: readonly GameEvent[]) => void;
  private el?: HTMLDivElement;

  mount(container: HTMLElement, sim: Readonly<GameSim>): void {
    this.sim = sim;
    this.el = document.createElement('div');
    container.appendChild(this.el);    // DOM work is allowed here — not in StubSim
  }

  render(): void {
    if (this.el) this.el.textContent = String(this.sim.getScore());
  }

  onScore(cb: (raw: number, events: readonly GameEvent[]) => void): void {
    this.scoreCb = cb;
  }

  destroy(): void {
    this.el?.remove();
    this.el = undefined;
    this.scoreCb = undefined;
    // Remove any event listeners added during mount() here.
  }
}

export const StubGame: GameModule = {
  meta: {
    id: 'stub-game',
    slug: 'stub-game',
    title: 'Stub Game',
    controlScheme: 'tap',              // PR-6: never use 'tilt'
    durationSeconds: 30,
    difficultyCurve: 'flat',
    themeTags: ['stub'],
    generatedBy: 'human',
    contractVersion: '1.0.0',          // PR-4: pin to current contract semver
    gameVersion: '1.0.0',              // PR-4: bump when balance changes
  },
  createSim: () => new StubSim(),
  createView: () => new StubView(),
};
```

---

## Build-gate reminders (G2)

| Banned string | Reason |
|---|---|
| `Math.random` | PR-1: use injected prng |
| `Date.now` | PR-1 + PR-2: wall-clock forbidden in sim |
| `performance.now` | PR-1 + PR-2: wall-clock forbidden in sim |
| `tilt` in active game pool | PR-6: reserved, unimplemented |

G2 must reject any game bundle that contains the banned strings, regardless of whether they appear in sim or view.

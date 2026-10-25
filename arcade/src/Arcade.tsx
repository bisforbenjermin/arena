import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameEvent, GameModule } from '../../contracts/game-module';
import TailspinModule from '../../games/tailspin/index';
import StackShiftModule from '../../games/stack-shift/index';
import GlyphTraceModule from '../../games/glyph-trace/index';
import { replayScore, runModule } from './runtime';
import { pacificDay, seedNumber } from './seed';

// Bow Hunt left this page on 2026-10-25: it is now its own Phaser build in bow-hunt/ with its own link.
type CabinetId = 'tailspin' | 'stack-shift' | 'glyph-trace';

type Cabinet = {
  id: CabinetId;
  title: string;
  pitch: string;
  how: string;
  facts: string;
  kind: 'standalone' | 'f1';
  module?: GameModule;
  accent: string;
  /** Canvas width ÷ height, so the stage can fit the game to the screen height. */
  ratio: number;
};

const CABINETS: Cabinet[] = [
  {
    id: 'tailspin',
    title: 'Tailspin',
    pitch: 'A raccoon flies through a cave on the power of his own tail.',
    how: 'Hold to spin the tail and climb. Let go to drop. Thread the gold middle of each gate to build a streak.',
    facts: 'Arena game · 60 seconds · hold',
    kind: 'f1',
    module: TailspinModule,
    accent: 'var(--cyan)',
    ratio: 16 / 10,
  },
  {
    id: 'stack-shift',
    title: 'Stack Shift',
    pitch: 'Fill rows and columns on an 8 × 12 grid before the clock runs out.',
    how: 'Tap the piece in the tray to rotate it. Drag it onto the grid to place it. Two lines at once doubles the points.',
    facts: 'Arena game · 60 seconds · drag',
    kind: 'f1',
    module: StackShiftModule,
    accent: 'var(--crimson-bright)',
    ratio: 4 / 7,
  },
  {
    id: 'glyph-trace',
    title: 'Glyph Trace',
    pitch: 'Trace each shape in order, fast and clean.',
    how: 'Touch the yellow dot, then trace through every dot in order without lifting. Finish inside 1.5 seconds for a speed bonus.',
    facts: 'Arena game · 60 seconds · drag',
    kind: 'f1',
    module: GlyphTraceModule,
    accent: 'var(--violet)',
    ratio: 2 / 3,
  },
];

type Result = { score: number; verified: number | null };

function readHash(): CabinetId | null {
  try {
    const h = window.location.hash.replace('#', '');
    return CABINETS.some((c) => c.id === h) ? (h as CabinetId) : null;
  } catch {
    return null;
  }
}

function F1Stage({ mod, seed, ratio, onResult }: { mod: GameModule; seed: number; ratio: number; onResult: (r: Result) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onResult);
  cb.current = onResult;
  useEffect(() => {
    if (!ref.current) return;
    return runModule(mod, ref.current, seed, (score: number, events: readonly GameEvent[]) => {
      cb.current({ score, verified: null });
      setTimeout(() => cb.current({ score, verified: replayScore(mod, seed, events) }), 30);
    });
  }, [mod, seed]);
  return <div className="stage f1" ref={ref} style={{ ['--ratio' as string]: String(ratio) }} />;
}

export function Arcade() {
  const day = useMemo(() => pacificDay(), []);
  const [round, setRound] = useState(1);
  const [open, setOpen] = useState<CabinetId | null>(readHash);
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const seedLabel = `${day} · run ${round}`;
  const seedText = `arcade-${day}-${round}`;
  const seed = seedNumber(seedText);
  const cab = CABINETS.find((c) => c.id === open) ?? null;
  const playRef = useRef<HTMLElement>(null);

  // Opening a game scrolls it to the top so the whole playfield is on screen.
  useEffect(() => {
    if (open) playRef.current?.scrollIntoView({ block: 'start' });
  }, [open, runKey]);

  const go = (id: CabinetId | null) => {
    setOpen(id);
    setResult(null);
    setRunKey((k) => k + 1);
    try {
      if (id) window.location.hash = id;
      else history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch {
      /* hash routing unavailable */
    }
    if (!id) window.scrollTo({ top: 0 });
  };

  return (
    <main className="arcade">
      <header className="marquee">
        <h1 className="wordmark">ARENA ARCADE</h1>
        <p className="tagline">Play is the engine. Loot is the point.</p>
      </header>

      {!cab && (
        <>
          <section className="intro">
            <p>
              Four skill games, each driven entirely by one seed. Everyone who plays today’s seed gets the same
              turkeys, cave, pieces and glyphs, so the only difference between scores is how you play.
            </p>
            <div className="seedbar">
              <span>Seed: <strong className="mono">{seedLabel}</strong></span>
              <button className="ghost" onClick={() => setRound((r) => r + 1)}>New seed</button>
            </div>
          </section>
          <section className="cabinets">
            {CABINETS.map((c) => (
              <article key={c.id} className="cabinet" style={{ ['--cab' as string]: c.accent }}>
                <h2>{c.title}</h2>
                <p className="pitch">{c.pitch}</p>
                <p className="facts">{c.facts}</p>
                <button onClick={() => go(c.id)}>Play {c.title.split(':')[0]}</button>
              </article>
            ))}
          </section>
          <footer className="foot">
            <p>
              Each run ends with a replay check: the page feeds your recorded inputs through a fresh copy of the game
              and confirms it lands on the same score. That is the check a contest server runs before a score counts.
            </p>
          </footer>
        </>
      )}

      {cab && (
        <section className="play" ref={playRef} style={{ ['--cab' as string]: cab.accent }}>
          <div className="playhead">
            <button className="ghost" onClick={() => go(null)}>All games</button>
            <h2>{cab.title}</h2>
            <span className="mono seedtag">{seedLabel}</span>
          </div>
          {cab.kind === 'f1' && cab.module && (
            <F1Stage key={`${cab.id}-${runKey}-${seed}`} mod={cab.module} seed={seed} ratio={cab.ratio} onResult={setResult} />
          )}
          {!result && <p className="how">{cab.how}</p>}
          {result && (
            <div className="result" role="status">
              <p className="final">Final score <strong className="mono">{result.score.toLocaleString('en-US')}</strong></p>
              <p className="verify">
                {result.verified === null
                  ? 'Checking the replay…'
                  : result.verified === result.score
                    ? `Replay check passed: your inputs reproduce ${result.verified.toLocaleString('en-US')} exactly.`
                    : `Replay check failed: the replay produced ${result.verified.toLocaleString('en-US')}.`}
              </p>
              <div className="row">
                <button onClick={() => { setResult(null); setRunKey((k) => k + 1); }}>Play again</button>
                <button className="ghost" onClick={() => go(null)}>All games</button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

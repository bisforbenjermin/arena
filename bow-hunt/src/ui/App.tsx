import { useState } from 'react';
import { DEFAULT_SEED } from '../engine/constants';
import { compressInputs } from '../engine/replay';
import type { GameState, Input } from '../engine/types';
import { Game } from './Game';

function seedFromUrl(): string {
  try {
    return new URLSearchParams(window.location.search).get('seed') || DEFAULT_SEED;
  } catch {
    return DEFAULT_SEED;
  }
}

export function App() {
  const [seed] = useState(seedFromUrl);
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<{ log: Input[]; s: GameState } | null>(null);
  const [copied, setCopied] = useState(false);

  const copyReplay = async () => {
    if (!result) return;
    const text = JSON.stringify({ version: 1, seed, inputs: compressInputs(result.log) });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="app">
      <h1>Bow Hunt: Thanksgiving</h1>
      <p className="hint">Press, drag back like a bowstring, release. Hold longer for more power.</p>
      <Game
        key={runKey}
        seed={seed}
        onFinish={(log, s) => setResult({ log, s })}
      />
      {result && (
        <div className="overlay" role="dialog">
          <h2>{result.s.outcome === 'cleared' ? 'Feast secured!' : 'The turkeys got away.'}</h2>
          <p>{`Final score ${result.s.score}`}</p>
          <div className="row">
            <button onClick={() => { setResult(null); setCopied(false); setRunKey((k) => k + 1); }}>Play again</button>
            <button onClick={copyReplay}>{copied ? 'Copied' : 'Copy replay'}</button>
          </div>
        </div>
      )}
    </main>
  );
}

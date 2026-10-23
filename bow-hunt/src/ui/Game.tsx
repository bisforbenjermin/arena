import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { WORLD_H, WORLD_W } from '../engine/constants';
import { generateRunPlan } from '../engine/plan';
import { createInitialState, step } from '../engine/sim';
import type { GameState, Input } from '../engine/types';
import { drawFrame } from './draw';
import { Hud } from './Hud';
import { dragAim, toWorld, type Point } from './input';
import { ticksToRun } from './loop';

export type GameProps = {
  seed: string;
  replay?: Input[];
  speed?: number;
  onFinish?: (log: Input[], s: GameState) => void;
};

export function Game({ seed, replay, speed, onFinish }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState(generateRunPlan(seed)));
  const logRef = useRef<Input[]>([]);
  const aimRef = useRef<Point>({ x: 480, y: 100 });
  const anchorRef = useRef<Point | null>(null);
  const drawingRef = useRef(false);
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const speedRef = useRef(speed ?? 1);
  speedRef.current = speed ?? 1;
  const [hud, setHud] = useState<GameState>(stateRef.current);

  useEffect(() => {
    if (typeof requestAnimationFrame === 'undefined') return;
    let raf = 0;
    let last: number | null = null;
    let acc = 0;
    const frame = (now: number) => {
      const frameMs = last === null ? 0 : Math.min(now - last, 250);
      last = now;
      const r = ticksToRun(acc, frameMs);
      acc = r.accMs;
      const n = r.steps * speedRef.current;
      let s = stateRef.current;
      for (let i = 0; i < n && s.phase !== 'over'; i++) {
        let input: Input;
        if (replay) {
          if (s.tick >= replay.length) break;
          input = replay[s.tick];
          aimRef.current = { x: input.aimX, y: input.aimY };
        } else {
          input = { aimX: aimRef.current.x, aimY: aimRef.current.y, drawing: drawingRef.current };
          logRef.current.push(input);
        }
        s = step(s, input);
      }
      stateRef.current = s;
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawFrame(ctx, s, aimRef.current);
      setHud((prev) => (prev.tick === s.tick && prev.phase === s.phase ? prev : s));
      if (s.phase === 'over' && !finishedRef.current) {
        finishedRef.current = true;
        onFinishRef.current?.(logRef.current, s);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [replay]);

  const pointFrom = (e: PointerEvent<HTMLCanvasElement>) =>
    toWorld(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (replay) return;
    anchorRef.current = pointFrom(e);
    drawingRef.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not supported */ }
  };
  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (replay || !drawingRef.current || !anchorRef.current) return;
    aimRef.current = dragAim(anchorRef.current, pointFrom(e));
  };
  const onUp = () => {
    if (replay) return;
    drawingRef.current = false;
    anchorRef.current = null;
  };

  return (
    <div className="game">
      <Hud s={hud} />
      <canvas
        ref={canvasRef}
        width={WORLD_W}
        height={WORLD_H}
        className="game-canvas"
        style={{ width: '100%', maxWidth: 960, aspectRatio: '16/9', touchAction: 'none' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
    </div>
  );
}

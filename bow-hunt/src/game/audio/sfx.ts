// Every sound is synthesized with WebAudio. No files to load, nothing to license.
import type { Species } from '../../engine/species';

type Env = { a?: number; d: number; peak?: number };

class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private _muted = false;

  get muted(): boolean { return this._muted; }
  set muted(m: boolean) {
    this._muted = m;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx.currentTime, 0.02);
  }

  /** Call from a user gesture. iOS only lets audio start inside one. */
  unlock(): void {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : 0.55;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(this.ctx.destination);
      const len = this.ctx.sampleRate;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  private get ready(): boolean { return !!this.ctx && !!this.master && this.ctx.state === 'running'; }

  private env(g: GainNode, t: number, e: Env): void {
    const a = e.a ?? 0.005, peak = e.peak ?? 1;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + e.d);
  }

  private tone(type: OscillatorType, f0: number, f1: number, t: number, e: Env, out?: AudioNode): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + (e.a ?? 0.005) + e.d);
    this.env(g, t, e);
    o.connect(g).connect(out ?? this.master!);
    o.start(t);
    o.stop(t + (e.a ?? 0.005) + e.d + 0.05);
  }

  private noise(t: number, e: Env, filter: BiquadFilterType, f0: number, f1: number, q = 1): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const bf = ctx.createBiquadFilter();
    bf.type = filter; bf.Q.value = q;
    bf.frequency.setValueAtTime(f0, t);
    bf.frequency.exponentialRampToValueAtTime(f1, t + (e.a ?? 0.005) + e.d);
    const g = ctx.createGain();
    this.env(g, t, e);
    src.connect(bf).connect(g).connect(this.master!);
    src.start(t, Math.random() * 0.5);
    src.stop(t + (e.a ?? 0.005) + e.d + 0.05);
  }

  draw(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    this.noise(t, { a: 0.08, d: 0.35, peak: 0.12 }, 'bandpass', 300, 900, 6);
  }

  fullDraw(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    this.tone('square', 1800, 1700, t, { d: 0.03, peak: 0.08 });
  }

  release(power: number): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    const p = Math.min(1, power / 40);
    this.tone('triangle', 180 + p * 160, 70, t, { d: 0.22, peak: 0.6 });
    this.noise(t, { d: 0.04, peak: 0.3 }, 'highpass', 2500, 2000);
    this.noise(t + 0.02, { a: 0.03, d: 0.25, peak: 0.18 * (0.5 + p) }, 'bandpass', 2400, 600, 2);
  }

  hit(species: Species, streak: number): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    this.tone('sine', 160, 50, t, { d: 0.12, peak: 0.8 });
    this.noise(t, { d: 0.05, peak: 0.35 }, 'bandpass', 1400, 700, 1);
    const call = t + 0.04;
    if (species === 'duck') {
      this.tone('sawtooth', 620, 420, call, { d: 0.14, peak: 0.18 });
      this.tone('sawtooth', 560, 380, call + 0.13, { d: 0.12, peak: 0.14 });
    } else if (species === 'goose') {
      this.tone('sawtooth', 330, 270, call, { a: 0.02, d: 0.22, peak: 0.2 });
    } else if (species === 'turkey') {
      for (let i = 0; i < 5; i++) this.tone('square', 520 - i * 25, 440 - i * 25, call + i * 0.045, { d: 0.035, peak: 0.1 });
    } else {
      [1047, 1319, 1568, 2093].forEach((f, i) => this.tone('sine', f, f, t + i * 0.07, { d: 0.4, peak: 0.3 }));
    }
    if (streak >= 2) {
      const f = 440 * Math.pow(2, Math.min(streak - 1, 12) / 12);
      this.tone('triangle', f, f * 1.01, t + 0.08, { d: 0.12, peak: 0.18 });
    }
  }

  multi(n: number): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    for (let i = 0; i < n; i++) this.tone('triangle', 880 * (1 + i * 0.26), 900 * (1 + i * 0.26), t + 0.12 + i * 0.06, { d: 0.12, peak: 0.22 });
  }

  /** Hummingbird zipping past: a fast buzzing sweep. */
  zip(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    this.tone('sawtooth', 180, 120, t, { a: 0.05, d: 0.6, peak: 0.06 });
    this.noise(t, { a: 0.05, d: 0.55, peak: 0.08 }, 'bandpass', 300, 1800, 8);
  }

  landed(): void {
    if (!this.ready) return;
    this.noise(this.ctx!.currentTime, { d: 0.12, peak: 0.12 }, 'lowpass', 500, 200);
  }

  escape(): void {
    if (!this.ready) return;
    this.noise(this.ctx!.currentTime, { a: 0.05, d: 0.25, peak: 0.05 }, 'bandpass', 900, 2200, 4);
  }

  outOfArrows(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    this.tone('sine', 300, 140, t, { d: 0.25, peak: 0.3 });
  }

  horn(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(this.master!);
    [[392, 0], [523, 0.16], [659, 0.32]].forEach(([f, dt]) => this.tone('sawtooth', f, f, t + dt, { a: 0.03, d: dt === 0.32 ? 0.45 : 0.14, peak: 0.16 }, lp));
  }

  roundClear(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => this.tone('triangle', f, f, t + i * 0.09, { d: 0.3, peak: 0.25 }));
  }

  fail(): void {
    if (!this.ready) return;
    const t = this.ctx!.currentTime;
    [392, 330, 262].forEach((f, i) => this.tone('triangle', f, f * 0.97, t + i * 0.16, { d: 0.32, peak: 0.25 }));
  }

  click(): void {
    if (!this.ready) return;
    this.tone('square', 900, 600, this.ctx!.currentTime, { d: 0.04, peak: 0.08 });
  }

  tick(): void {
    if (!this.ready) return;
    this.tone('sine', 1200, 1200, this.ctx!.currentTime, { d: 0.03, peak: 0.07 });
  }
}

export const sfx = new Sfx();

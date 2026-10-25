import Phaser from 'phaser';
import { DRAW_MAX_TICKS, MILLI as M, GROUND_Y } from '../../engine/constants';
import type { GameEvent, Mode, Target } from '../../engine/types';
import { sfx } from '../audio/sfx';
import { C, DEPTH, N, S, VIEW_H, VIEW_W } from '../config';
import { Effects } from '../fx/effects';
import { aimFromDrag, STRAIGHT_UP, type Aim } from '../input';
import { RunController } from '../run';
import { buildBackdrop } from '../ui/backdrop';
import { BowView } from '../ui/bow';
import { Hud } from '../ui/hud';
import { button, drawPause, drawSpeaker, iconButton, tag, text } from '../ui/widgets';
import { getMuted, setMuted } from '../session';

type BirdView = { sprite: Phaser.GameObjects.Sprite; glow?: Phaser.GameObjects.Image; spin: number; age: number };
export type PlayData = { mode: Mode; seed: string };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class PlayScene extends Phaser.Scene {
  private run!: RunController;
  private mode!: Mode;
  private hud!: Hud;
  private fx!: Effects;
  private bow!: BowView;
  private birds = new Map<number, BirdView>();
  private arrows = new Map<number, Phaser.GameObjects.Image>();
  private aim: Aim = STRAIGHT_UP;
  private anchor: { x: number; y: number } | null = null;
  private drawing = false;
  private paused = false;
  private pauseLayer!: Phaser.GameObjects.Container;
  private ending = false;
  private wasFull = false;

  constructor() { super('Play'); }

  init(data: PlayData) {
    this.mode = data.mode;
    this.run = new RunController(data.mode, data.seed);
    this.birds = new Map();
    this.arrows = new Map();
    this.aim = STRAIGHT_UP;
    this.anchor = null;
    this.drawing = false;
    this.paused = false;
    this.ending = false;
  }

  create() {
    buildBackdrop(this);
    this.fx = new Effects(this);
    this.hud = new Hud(this, this.mode);
    this.bow = new BowView(this, this.mode === 'practice');
    this.hud.setRound(0);
    this.hud.setArrows(this.run.state.arrowsLeft);
    this.startRoundBanner();

    const pauseBtn = iconButton(this, 868, 262, drawPause, () => this.setPaused(true));
    pauseBtn.box.setDepth(DEPTH.hud);
    sfx.muted = getMuted();
    const sound = iconButton(this, 984, 262, (g) => drawSpeaker(g, sfx.muted), () => {
      sfx.muted = !sfx.muted; setMuted(sfx.muted); drawSpeaker(sound.icon, sfx.muted);
    });
    sound.box.setDepth(DEPTH.hud);
    this.pauseLayer = this.buildPauseLayer();

    this.input.on('pointerdown', (p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (this.paused || over.length > 0) return;
      sfx.unlock();
      this.anchor = { x: p.x / S, y: p.y / S };
      this.drawing = true;
      if (this.run.state.phase === 'playing' && this.run.state.arrowsLeft > 0) sfx.draw();
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.anchor || !p.isDown) return;
      this.aim = aimFromDrag(this.anchor.x, this.anchor.y, p.x / S, p.y / S, this.aim);
    });
    const release = () => { this.anchor = null; this.drawing = false; };
    this.input.on('pointerup', release);
    this.input.on('pointerupoutside', release);

    const autoPause = () => { if (!this.ending) this.setPaused(true); };
    this.game.events.on(Phaser.Core.Events.HIDDEN, autoPause);
    this.game.events.on(Phaser.Core.Events.BLUR, autoPause);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Phaser.Core.Events.HIDDEN, autoPause);
      this.game.events.off(Phaser.Core.Events.BLUR, autoPause);
    });

    this.cameras.main.fadeIn(240, 43, 29, 36);
  }

  update(_time: number, delta: number) {
    if (this.paused) return;
    const events = this.run.advance(delta, { aimX: this.aim.aimX, aimY: this.aim.aimY, drawing: this.drawing });
    for (const e of events) this.onEvent(e);
    if (events.length) this.hud.setStreak(this.run.state.streak);
    this.renderState();
    if (this.run.waiting && !this.ending) this.endOfRound();
  }

  private onEvent(e: GameEvent): void {
    const st = this.run.state;
    switch (e.type) {
      case 'fire': {
        sfx.release(e.power);
        this.bow.kick();
        this.hud.setArrows(st.arrowsLeft);
        break;
      }
      case 'hit': {
        const x = e.x / M * S, y = e.y / M * S;
        const view = this.birds.get(e.targetId);
        if (view) { this.fx.flash(view.sprite); view.sprite.stop(); view.sprite.setFrame(0); view.spin = (view.sprite.flipX ? -1 : 1) * (0.1 + Math.random() * 0.06); }
        const golden = e.species === 'golden';
        this.fx.burst(x, y, e.species);
        this.fx.shake(golden || e.multi >= 2 ? 'big' : 'small');
        this.fx.points(x, y - 30, e.points, golden);
        let noteY = y + 50, delay = 120;
        if (e.multi >= 2) { this.fx.note(x, noteY, e.multi === 2 ? 'Double!' : e.multi === 3 ? 'Triple!' : `${e.multi} in one!`, C.paper, delay); noteY += 52; delay += 80; sfx.multi(e.multi); }
        if (e.long) this.fx.note(x, noteY, 'Long shot', C.gold, delay);
        this.hud.markHit(golden);
        this.hud.setScore(st.score);
        sfx.hit(e.species, e.streak);
        break;
      }
      case 'escape': {
        this.hud.markMissed();
        sfx.escape();
        this.dropBird(e.targetId);
        break;
      }
      case 'landed': {
        this.fx.puff(e.x / M * S, GROUND_Y * S - 10);
        sfx.landed();
        this.dropBird(e.targetId);
        break;
      }
      case 'outOfArrows': {
        this.hud.notice('Out of arrows. The flock flies off.');
        sfx.outOfArrows();
        break;
      }
      case 'roundEnd': {
        this.hud.missRemaining();
        this.hud.setScore(st.score);
        break;
      }
      default: break;
    }
  }

  private dropBird(id: number): void {
    const v = this.birds.get(id);
    if (!v) return;
    v.sprite.destroy();
    v.glow?.destroy();
    this.birds.delete(id);
  }

  private makeBird(t: Target): BirdView {
    // golden art is drawn on the turkey body but its hit circle is smaller (26 vs 30), so shrink it to match
    const sprite = this.add.sprite(0, 0, `${t.species}-0`).setDepth(DEPTH.birds).setFlipX(t.dir < 0).setScale(t.species === 'golden' ? 26 / 30 : 1);
    sprite.play({ key: `${t.species}-flap`, startFrame: Math.floor(Math.random() * 4) });
    const glow = t.species === 'golden'
      ? this.add.image(0, 0, 'glow').setDepth(DEPTH.birds - 1).setBlendMode(Phaser.BlendModes.ADD).setScale(1.1)
      : undefined;
    return { sprite, glow, spin: 0, age: 0 };
  }

  private renderState(): void {
    const { prev, state: cur, alpha } = this.run;
    const prevT = new Map(prev.targets.map((t) => [t.id, t]));
    const seen = new Set<number>();
    for (const t of cur.targets) {
      seen.add(t.id);
      let v = this.birds.get(t.id);
      if (!v) { v = this.makeBird(t); this.birds.set(t.id, v); }
      const p = prevT.get(t.id) ?? t;
      const x = lerp(p.x, t.x, alpha) / M * S, y = lerp(p.y, t.y, alpha) / M * S;
      v.sprite.setPosition(x, y);
      v.age++;
      if (t.status === 'falling') {
        v.sprite.rotation += v.spin;
        if (v.glow) v.glow.setVisible(false);
      } else {
        const tilt = Phaser.Math.Clamp(t.vy / Math.max(Math.abs(t.vx), 1) * 0.6, -0.5, 0.5) * (t.dir > 0 ? 1 : -1);
        v.sprite.rotation = t.status === 'fleeing' ? -0.45 * t.dir : tilt;
        if (v.glow) {
          v.glow.setPosition(x, y).setAlpha(0.55 + 0.25 * Math.sin(v.age * 0.15));
          if (v.age % 5 === 0) this.fx.sparkleTrail(x - t.dir * 40, y + (Math.random() - 0.5) * 30);
        }
      }
    }
    for (const id of [...this.birds.keys()]) if (!seen.has(id)) this.dropBird(id);

    const prevA = new Map(prev.arrows.map((a) => [a.id, a]));
    const live = new Set<number>();
    for (const a of cur.arrows) {
      live.add(a.id);
      let img = this.arrows.get(a.id);
      if (!img) { img = this.add.image(0, 0, 'arrow').setOrigin((104 - 2) / 104, 0.5).setDepth(DEPTH.arrows); this.arrows.set(a.id, img); }
      const p = prevA.get(a.id) ?? a;
      img.setPosition(lerp(p.x, a.x, alpha) / M * S, lerp(p.y, a.y, alpha) / M * S).setRotation(Math.atan2(a.vy, a.vx));
    }
    for (const [id, img] of this.arrows) if (!live.has(id)) { img.destroy(); this.arrows.delete(id); }

    const armed = cur.phase === 'playing' && cur.arrowsLeft > 0;
    this.bow.update(this.aim, cur.drawTicks, armed || cur.phase === 'intro', this.drawing && cur.phase === 'playing');
    const full = cur.drawTicks >= DRAW_MAX_TICKS;
    if (full && !this.wasFull && armed) sfx.fullDraw();
    this.wasFull = full;
  }

  private startRoundBanner(): void {
    this.hud.showBanner(this.run.state.round);
    this.time.delayedCall(250, () => sfx.horn());
  }

  private endOfRound(): void {
    this.ending = true;
    this.drawing = false;
    this.anchor = null;
    const st = this.run.state;
    const summary = st.summaries[st.summaries.length - 1];
    if (st.phase === 'roundEnd') {
      sfx.roundClear();
      this.time.delayedCall(650, () => {
        this.scene.launch('Results', { summary, score: st.score, onNext: () => this.continueRun() });
        this.scene.pause();
      });
    } else {
      if (st.outcome === 'cleared') sfx.roundClear(); else sfx.fail();
      const verified = this.run.verify();
      this.time.delayedCall(900, () => {
        this.scene.launch('GameOver', { mode: this.mode, seed: this.run.seed, state: st, verified });
        this.scene.pause();
      });
    }
  }

  /** Called by the Results card's Next round button. */
  continueRun(): void {
    this.run.nextRound();
    this.ending = false;
    this.wasFull = false;
    for (const img of this.arrows.values()) img.destroy();
    this.arrows.clear();
    this.hud.setRound(this.run.state.round);
    this.hud.setArrows(this.run.state.arrowsLeft);
    this.hud.setStreak(this.run.state.streak);
    this.scene.resume();
    this.startRoundBanner();
  }

  private setPaused(p: boolean): void {
    if (p === this.paused || this.ending) return;
    this.paused = p;
    this.pauseLayer.setVisible(p);
    this.anchor = null;
    this.drawing = false;
    if (p) this.tweens.pauseAll(); else this.tweens.resumeAll();
    this.anims.pauseAll();
    if (!p) this.anims.resumeAll();
  }

  private buildPauseLayer(): Phaser.GameObjects.Container {
    const c = this.add.container(0, 0).setDepth(DEPTH.overlay).setVisible(false);
    const veil = this.add.rectangle(0, 0, VIEW_W, VIEW_H, N.plum, 0.6).setOrigin(0).setInteractive();
    const card = this.add.container(540, 760);
    card.add(tag(this, 640, 520, { twine: true }).setPosition(-320, -220));
    card.add(text(this, 0, -110, 'Paused', { size: 96, align: 'center' }).setOrigin(0.5));
    card.add(text(this, 0, -20, 'The flock waits for you.', { size: 46, font: 'hand', align: 'center' }).setOrigin(0.5));
    c.add([veil, card]);
    c.add(button(this, 540, 880, 460, 130, 'Resume', 'primary', () => this.setPaused(false)));
    c.add(button(this, 540, 1040, 460, 120, 'Quit to menu', 'kraft', () => { this.scene.start('Title'); }));
    return c;
  }
}

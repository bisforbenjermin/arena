import Phaser from 'phaser';
import { BOWS, MILLI as M, GROUND_Y, STARS_FOR_BONUS } from '../../engine/constants';
import { isBonus, isPowerUp } from '../../engine/species';
import { upgradeAfter } from '../../engine/sim';
import type { GameEvent, Mode, Target } from '../../engine/types';
import { sfx } from '../audio/sfx';
import { C, DEPTH, N, S, VIEW_H, VIEW_W } from '../config';
import { Effects } from '../fx/effects';
import { aimForAngle, aimFromDrag, STRAIGHT_UP, type Aim } from '../input';
import { RunController } from '../run';
import { buildBackdrop } from '../ui/backdrop';
import { BowView } from '../ui/bow';
import { Hud } from '../ui/hud';
import { button, drawPause, drawSpeaker, fit, iconButton, tag, text } from '../ui/widgets';
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
  private keys?: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; space: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key };
  private spaceDrawing = false;
  private pointerDrawing = false;

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
    this.hud.setBow(BOWS[0].name);
    this.hud.setArrows(this.run.state.arrowsLeft, BOWS[this.run.state.bow].arrows);
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
      this.pointerDrawing = true;
      if (this.run.state.phase === 'playing' && this.run.state.arrowsLeft > 0) sfx.draw();
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.anchor || !p.isDown) return;
      this.aim = aimFromDrag(this.anchor.x, this.anchor.y, p.x / S, p.y / S, this.aim);
    });
    const release = () => { this.anchor = null; this.pointerDrawing = false; };
    this.input.on('pointerup', release);
    this.input.on('pointerupoutside', release);

    // Keyboard: left/right (or A/D) swing the bow, hold space to draw, let go to shoot. Esc or P pauses.
    if (this.input.keyboard) {
      const K = Phaser.Input.Keyboard.KeyCodes;
      this.keys = this.input.keyboard.addKeys({ left: K.LEFT, right: K.RIGHT, up: K.UP, down: K.DOWN, space: K.SPACE, a: K.A, d: K.D }, true) as PlayScene['keys'];
      this.input.keyboard.on('keydown-SPACE', () => { if (!this.paused) { sfx.unlock(); this.spaceDrawing = true; if (this.run.state.phase === 'playing' && this.run.state.arrowsLeft > 0) sfx.draw(); } });
      this.input.keyboard.on('keyup-SPACE', () => { this.spaceDrawing = false; });
      this.input.keyboard.on('keydown-ESC', () => this.setPaused(!this.paused));
      this.input.keyboard.on('keydown-P', () => this.setPaused(!this.paused));
    }

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
    this.steerWithKeys(delta);
    this.drawing = this.pointerDrawing || this.spaceDrawing;
    const events = this.run.advance(delta, { aimX: this.aim.aimX, aimY: this.aim.aimY, drawing: this.drawing });
    for (const e of events) this.onEvent(e);
    if (events.length) this.hud.setStreak(this.run.state.streak);
    this.renderState();
    if (this.run.waiting && !this.ending) this.endOfRound();
  }

  /** Arrow keys swing the bow about 100° a second; up re-centers it straight up. */
  private steerWithKeys(delta: number): void {
    const k = this.keys;
    if (!k) return;
    const dir = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0);
    if (dir !== 0) this.aim = aimForAngle(this.aim.angle + dir * delta * 0.0018);
    else if (k.up.isDown) this.aim = aimForAngle(this.aim.angle * 0.85);
  }

  private onEvent(e: GameEvent): void {
    const st = this.run.state;
    switch (e.type) {
      case 'fire': {
        sfx.release(e.power);
        this.bow.kick();
        this.hud.setFire(st.fireShots);
        this.hud.setArrows(st.arrowsLeft, BOWS[st.bow].arrows);
        break;
      }
      case 'hit': {
        const x = e.x / M * S, y = e.y / M * S;
        const view = this.birds.get(e.targetId);
        if (view) { this.fx.flash(view.sprite); view.sprite.stop(); view.sprite.setFrame(0); view.spin = (view.sprite.flipX ? -1 : 1) * (0.1 + Math.random() * 0.06); }
        const golden = e.species === 'golden' || isBonus(e.species);
        this.fx.burst(x, y, e.species);
        this.fx.shake(golden || e.multi >= 2 ? 'big' : 'small');
        this.fx.points(x, y - 30, e.points, golden);
        let noteY = y + 50, delay = 120;
        if (e.multi >= 2) {
          const label = e.multi === 2 ? 'Double!' : e.multi === 3 ? 'Triple!' : e.multi === 4 ? 'Quad!' : `${e.multi} in one!`;
          this.fx.note(x, noteY, label, e.multi >= 3 ? C.gold : C.paper, delay); noteY += 52; delay += 80; sfx.multi(e.multi);
          if (e.multi >= 3) { this.fx.shake('big'); this.hud.notice(e.multi >= 4 ? 'QUAD KILL' : 'TRIPLE KILL'); }
        }
        if (e.long) this.fx.note(x, noteY, 'Long shot', C.gold, delay);
        if (e.species === 'star') { this.hud.setStars(st.stats.stars); this.fx.note(x, y + 50, `Star ${st.stats.stars} of ${STARS_FOR_BONUS}`, C.gold, 100); }
        else if (isPowerUp(e.species)) { /* the powerUp event shows its own note */ }
        else if (e.species === 'hummer') { this.fx.note(x, y + 50, 'Hummingbird!', C.gold, 100); this.fx.shake('big'); }
        else this.hud.markHit(e.species === 'golden');
        this.hud.setScore(st.score);
        sfx.hit(e.species, e.streak);
        break;
      }
      case 'spawn': {
        if (e.species === 'hummer') sfx.zip();
        break;
      }
      case 'powerUp': {
        const px = e.x / M * S, py = e.y / M * S;
        if (e.kind === 'quiver') { this.fx.note(px, py + 40, '+3 arrows', C.paper, 60); this.hud.setArrows(st.arrowsLeft, Math.max(BOWS[st.bow].arrows, st.arrowsLeft)); }
        else this.fx.note(px, py + 40, 'Fire arrows!', C.gold, 60);
        this.hud.setFire(st.fireShots);
        sfx.multi(2);
        break;
      }
      case 'starBonus': {
        this.hud.notice(`Three stars! +${e.points.toLocaleString('en-US')}`);
        this.fx.shake('big');
        sfx.roundClear();
        this.hud.setScore(st.score);
        break;
      }
      case 'escape': {
        if (this.wasBonus(e.targetId)) { this.dropBird(e.targetId); break; }
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

  private wasBonus(id: number): boolean {
    return this.run.prev.targets.some((t) => t.id === id && isBonus(t.species));
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
    // Art is drawn a bit smaller than the (generous) hit circles; scale it up partway. Golden turkeys are smaller turkeys.
    const scale = t.species === 'golden' ? 1.25 * 42 / 49 : t.species === 'hummer' ? 1.1 : 1.25;
    const still = t.species === 'star' || isPowerUp(t.species);
    const sprite = this.add.sprite(0, 0, still ? t.species : `${t.species}-0`).setDepth(DEPTH.birds).setFlipX(t.dir < 0 && !still).setScale(isPowerUp(t.species) ? 1.45 : still ? 1 : scale);
    if (!still) sprite.play({ key: `${t.species}-flap`, startFrame: Math.floor(Math.random() * 4) });
    const glow = t.species === 'golden' || t.species === 'star' || t.species === 'hummer' || isPowerUp(t.species)
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
        if (isPowerUp(t.species)) {
          v.sprite.rotation = Math.sin(v.age * 0.05) * 0.12;
          if (v.glow) v.glow.setPosition(x, y).setScale(0.9 + 0.12 * Math.sin(v.age * 0.12)).setAlpha(0.55);
          continue;
        }
        if (t.species === 'star') {
          v.sprite.rotation += 0.06 * t.dir;
          if (v.glow) v.glow.setPosition(x, y).setAlpha(0.6 + 0.3 * Math.sin(v.age * 0.2));
          if (v.age % 3 === 0) this.fx.sparkleTrail(x - t.dir * 50, y + (Math.random() - 0.5) * 20);
          continue;
        }
        if (t.species === 'hummer' && v.glow) {
          v.glow.setPosition(x, y).setScale(0.6).setAlpha(0.45);
          if (v.age % 2 === 0) this.fx.sparkleTrail(x - t.dir * 30, y);
        }
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
      if (!img) { img = this.add.image(0, 0, a.fire ? 'arrow-fire' : 'arrow').setOrigin((104 - 2) / 104, 0.5).setDepth(DEPTH.arrows); this.arrows.set(a.id, img); }
      const p = prevA.get(a.id) ?? a;
      img.setPosition(lerp(p.x, a.x, alpha) / M * S, lerp(p.y, a.y, alpha) / M * S).setRotation(Math.atan2(a.vy, a.vx));
      if (a.fire && cur.tick % 3 === 0) this.fx.ember(img.x, img.y);
    }
    for (const [id, img] of this.arrows) if (!live.has(id)) { img.destroy(); this.arrows.delete(id); }

    const armed = cur.phase === 'playing' && cur.arrowsLeft > 0;
    this.bow.update(this.aim, cur.drawTicks, armed || cur.phase === 'intro', this.drawing && cur.phase === 'playing', cur.fireShots > 0);
    const full = cur.drawTicks >= BOWS[cur.bow].drawMax;
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
    this.pointerDrawing = false;
    this.spaceDrawing = false;
    this.anchor = null;
    const st = this.run.state;
    const summary = st.summaries[st.summaries.length - 1];
    if (st.phase === 'roundEnd') {
      sfx.roundClear();
      this.time.delayedCall(650, () => {
        const offer = upgradeAfter(st.round);
        const choices = offer ? [offer[0], offer[1]] : undefined;
        this.scene.launch('Results', { summary, score: st.score, choices, current: BOWS[st.bow], onNext: (pick: number) => this.continueRun(pick) });
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
  continueRun(pick = 0): void {
    const before = this.run.state.bow;
    this.run.nextRound(pick);
    this.ending = false;
    this.wasFull = false;
    for (const img of this.arrows.values()) img.destroy();
    this.arrows.clear();
    this.hud.setRound(this.run.state.round);
    const bow = this.run.state.bow;
    this.hud.setArrows(this.run.state.arrowsLeft, BOWS[bow].arrows);
    this.hud.setStreak(this.run.state.streak);
    this.hud.setFire(this.run.state.fireShots);
    if (bow !== before) { this.bow.setBow(bow); this.bow.celebrate(); this.hud.setBow(BOWS[bow].name); }
    this.scene.resume();
    this.startRoundBanner();
  }

  private setPaused(p: boolean): void {
    if (p === this.paused || this.ending) return;
    this.paused = p;
    this.pauseLayer.setVisible(p);
    this.anchor = null;
    this.drawing = false;
    this.pointerDrawing = false;
    this.spaceDrawing = false;
    if (p) this.tweens.pauseAll(); else this.tweens.resumeAll();
    this.anims.pauseAll();
    if (!p) this.anims.resumeAll();
  }

  private buildPauseLayer(): Phaser.GameObjects.Container {
    const c = this.add.container(0, 0).setDepth(DEPTH.overlay).setVisible(false);
    const veil = this.add.rectangle(0, 0, VIEW_W, VIEW_H, N.plum, 0.6).setOrigin(0).setInteractive();
    const card = this.add.container(540, 760);
    card.add(tag(this, 640, 520, { twine: true }).setPosition(-320, -220));
    card.add(text(this, 0, -120, 'Paused', { size: 96, align: 'center' }).setOrigin(0.5));
    card.add(text(this, 0, -16, 'The flock waits for you.', { size: 46, font: 'hand', align: 'center' }).setOrigin(0.5));
    c.add([veil, card]);
    c.add(button(this, 540, 880, 460, 130, 'Resume', 'primary', () => this.setPaused(false)));
    c.add(button(this, 540, 1040, 460, 120, 'Quit to menu', 'kraft', () => { this.scene.start('Title'); }));
    return c;
  }
}

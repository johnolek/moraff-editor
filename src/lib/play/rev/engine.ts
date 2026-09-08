import { LEVELS } from '../../game/revmap.js';
import type { Rng } from '../../game/port/rng';
import { REV_POLLS_PER_TICK, REV_TICK_MS, revPoll } from './clock';
import { revFallDownAChute } from './chute';
import { revDie } from './death';
import { revMeetMonster, revMonsterAnswers, revOwnsWeapon, revSwing, revWeaponFor, NO_SUCH_WEAPON } from './fight';
import { revMonsterAttack } from './attack';
import { revKillMonster } from './kill';
import { REV_KEY, revArrowMode, revCompassArrow, revTurningArrow, revWrapFacing } from './keys';
import { revFeatureUnder, revLookDown } from './ladders';
import { RevMapMemory, type RevMapStore } from './memory';
import { DEFAULT_PLAY_MODE, type PlayMode } from '../mode';
import { revStep } from './move';
import { REV_UNBANKED_EXPERIENCE_VALUE, loadRevPlayer, revPlayerFromValues, revValue, saveRevPlayer } from './record';
import type { RunRecorder, RunSummary } from '../run';
import { revAdvice } from './advice';
import {
  revBuildingUnder,
  revStayAtInn,
  revVisitBank,
  revVisitGuild,
  revVisitStore,
  revVisitTemple,
  type RevTownDesk,
} from './town';
import { newRevGame, revWalker, type RevGame } from './state';
import type { RevStanding } from './monsters';
import { REV_NOT_BUILT } from './screens';

/**
 * The loop Moraff's Revenge is played in — the `INKEY$` poll at DUNSMALL.EXE 1000:087F and the
 * key dispatch at 1000:0CD2 behind it — and the session it is played out of.
 *
 * The original never blocks: it spins on `INKEY$` and rolls the monsters' clock on every pass.
 * Here the poll is a display timer (`clock.ts`) the session runs only while the loop is waiting
 * for a key, and each of its ticks is an input of its own in the run log, so a run replays
 * without any clock at all.
 */

/** How many keys are kept for a loop that is not waiting for one yet. */
const KEY_QUEUE = 4;

/** Not a key: the loop's wait hands this back when the save editor has written the record. */
export const REV_RECORD_EDITED = -0x201;

/** Not a key: one tick of the monsters' clock, which the log keeps where it happened. */
export const REV_CLOCK_TICK = -0x202;

/** Where the character record lives while it is being played. */
export interface RevCharacterFile {
  bytes: Uint8Array;
  /** 1000:B308: keep these bytes as the character from now on. */
  write(bytes: Uint8Array<ArrayBuffer>): void;
  /** The character has died, which the roster marks and never undoes. */
  died(): void;
  /** 1000:B583 and 1000:B964: the explored map kept beside the record, the way the game keeps
   *  `<n>.BIN` beside `<n>.EXE`. */
  map?: RevMapStore;
}

/** What the Play tab draws. */
export interface RevPlayView {
  place: { column: number; row: number; level: number; facing: number };
  /** Every monster standing on the level, for the map. */
  monsters: RevStanding[];
  /** The ones the character can see, which in this game is the one on their own square alone. */
  visible: RevStanding[];
  /** The lines the loop has printed. */
  box: string[];
  /** The line of advice the loop prints on its own row at the top of every pass. */
  advice: string[];
  /** The line the ladder, the chute and the rope put under the map. */
  prompt: string | null;
  /** What the fight is saying, which the original draws over the top of the screen. */
  banner: string[];
  /** The monster being fought, with what is left of it. */
  fight: { slot: number; name: number; monsterLevel: number; hitPoints: number } | null;
  /** Which way the arrows move, which Escape switches. */
  arrows: 'compass' | 'turning';
  over: boolean;
  dead: boolean;
  run: RunSummary | null;
}

/** One character being played. */
export class RevGameSession {
  readonly game: RevGame;
  over = false;
  dead = false;
  mode: PlayMode = DEFAULT_PLAY_MODE;
  onChange: (() => void) | null = null;

  private queued: number[] = [];
  private waiting: ((key: number) => void) | null = null;
  /** The record as the game last read it or wrote it back. */
  private known: Uint8Array;
  private edited: Uint8Array | null = null;
  /** The loop is at the poll with nothing of the game's own part-way through, which is where a
   *  tick of the monsters' clock belongs and where an edited record is safe to take. */
  private polling = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    readonly file: RevCharacterFile,
    rng: Rng,
    readonly run: RunRecorder | null = null,
  ) {
    const pc = loadRevPlayer(file.bytes) ?? revPlayerFromValues(new Array<number>(340).fill(0));
    this.known = file.bytes.slice();
    this.game = newRevGame(pc, rng, new RevMapMemory(file.map ?? null));
    this.game.monsters.stock(pc.dungeonLevel, rng);
    run?.watch(this.game.events, () => ({
      time: this.ticks,
      floor: this.game.pc.dungeonLevel,
      dungeon: 0,
    }));
  }

  /** How many ticks of the monsters' clock the run has spent, which is this game's own clock. */
  ticks = 0;

  /** A key from the Play tab. */
  press(key: number): void {
    const waiting = this.waiting;
    if (waiting) {
      this.waiting = null;
      waiting(key);
      return;
    }
    if (this.queued.length < KEY_QUEUE) this.queued.push(key);
  }

  /** 1000:2F71: the next key, once there is one. */
  key(): Promise<number> {
    const queued = this.queued.shift();
    if (queued !== undefined) {
      this.run?.input(queued);
      return Promise.resolve(queued);
    }
    this.changed();
    return new Promise((resolve) => {
      this.waiting = (key) => {
        // Neither of the two things that are not keys belongs in the log here: an edited record
        // is not an input at all, and a tick has already written itself down.
        if (key !== REV_RECORD_EDITED && key !== REV_CLOCK_TICK) this.run?.input(key);
        resolve(key);
      };
    });
  }

  /**
   * 1000:087F: the poll. It waits for a key the way {@link key} does, and while it waits the
   * monsters' clock runs.
   */
  async poll(): Promise<number> {
    this.polling = true;
    this.startClock();
    try {
      return await this.key();
    } finally {
      this.polling = false;
      this.stopClock();
    }
  }

  /**
   * One tick of the monsters' clock: the passes of the `INKEY$` poll that much wall-clock time
   * is worth, each rolling 1000:7EEC through the run's generator.
   *
   * It is written into the log as an input of its own, which is what lets a replay reproduce it
   * without a timer.
   */
  tick(): void {
    if (this.game.over || this.game.fight !== null) return;
    this.run?.input(REV_CLOCK_TICK);
    this.ticks += 1;
    const walker = revWalker(this.game);
    for (let pass = 0; pass < REV_POLLS_PER_TICK; pass++) revPoll(this.game.monsters, walker, this.game.lastMonsterLevel, this.game.rng);
    // 1000:08F6: a monster that has reached the character's square opens a fight at once.
    if (this.monsterHere() > 0) {
      const waiting = this.waiting;
      this.waiting = null;
      waiting?.(REV_CLOCK_TICK);
    }
    this.changed();
  }

  /** The slot standing on the character's own square (1000:08F6). */
  monsterHere(): number {
    const pc = this.game.pc;
    return this.game.monsters.slotOn(pc.column, pc.row);
  }

  private startClock(): void {
    if (this.timer !== null || typeof setInterval !== 'function') return;
    this.timer = setInterval(() => this.tick(), REV_TICK_MS);
  }

  private stopClock(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
  }

  /** 1000:B308 with the BSAVE it falls into: the record and the map, written back together. */
  save(): void {
    const bytes = saveRevPlayer(this.game.pc);
    this.known = bytes.slice();
    this.file.write(bytes);
    this.game.memory.save();
  }

  /** 1000:A249: the character's two files are deleted. The roster marks the entry instead and
   *  keeps the bytes, the way the other two games' ports do; the map really is thrown away. */
  die(): void {
    this.dead = true;
    this.over = true;
    this.game.over = true;
    this.run?.died();
    this.game.memory.forgetEverything();
    this.file.died();
  }

  /** 1000:4C28: the level changes, which re-stocks the monster grid. */
  enterLevel(level: number): void {
    const pc = this.game.pc;
    pc.dungeonLevel = Math.min(Math.max(level, 0), LEVELS);
    this.game.monsters.stock(pc.dungeonLevel, this.game.rng);
  }

  /** The save editor has written the record while the game is being played. */
  recordEdited(bytes: Uint8Array): void {
    if (sameBytes(bytes, this.known)) return;
    this.edited = bytes;
    if (!this.polling) return;
    const waiting = this.waiting;
    if (!waiting) return;
    this.waiting = null;
    waiting(REV_RECORD_EDITED);
  }

  /** Read the record again, if the save editor has written one. */
  takeEdits(): void {
    const bytes = this.edited;
    if (bytes === null) return;
    this.edited = null;
    this.known = bytes.slice();
    this.file.bytes = bytes;
    const read = loadRevPlayer(bytes);
    if (!read) return;
    const level = this.game.pc.dungeonLevel;
    Object.assign(this.game.pc, read, { facing: this.game.pc.facing });
    if (this.game.pc.dungeonLevel !== level) this.enterLevel(this.game.pc.dungeonLevel);
  }

  changed(): void {
    this.onChange?.();
  }

  /** Nothing is going to draw this session again. */
  finish(): void {
    this.stopClock();
  }

  /** The town desk, which is how a building asks its questions. */
  desk(): RevTownDesk {
    return {
      key: () => this.key(),
      number: async (prompt) => {
        this.game.say(...prompt);
        return revReadNumber(await this.key());
      },
    };
  }

  view(): RevPlayView {
    const game = this.game;
    const pc = game.pc;
    const monsters = game.monsters.standing();
    const here = this.monsterHere();
    return {
      place: { column: pc.column, row: pc.row, level: pc.dungeonLevel, facing: pc.facing },
      monsters,
      visible: monsters.filter((monster) => monster.slot === here),
      box: game.said,
      advice: game.advice,
      prompt: game.prompt,
      banner: game.banner,
      fight: game.fight
        ? {
            slot: game.fight.slot,
            name: game.fight.name,
            monsterLevel: game.fight.monsterLevel,
            hitPoints: game.fight.hitPoints,
          }
        : null,
      arrows: revArrowMode(game.arrowMode),
      over: this.over,
      dead: this.dead,
      run: this.run?.summary() ?? null,
    };
  }
}

/**
 * 1000:21F3: a number typed at a prompt.
 *
 * The original reads a whole line; the tab has no line editor of its own, so one digit key is
 * one number and anything else is nothing typed. What the buildings do with the answer is the
 * original's.
 */
export function revReadNumber(key: number): number | null {
  const digit = key - '0'.charCodeAt(0);
  return digit >= 0 && digit <= 9 ? digit : null;
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  for (let at = 0; at < left.length; at++) if (left[at] !== right[at]) return false;
  return true;
}

/** Start playing a character. */
export function startRevGame(file: RevCharacterFile, rng: Rng, run: RunRecorder | null = null): RevGameSession {
  return new RevGameSession(file, rng, run);
}

/** What the loop knows about the square before it reads a key. */
export interface RevTurn {
  session: RevGameSession;
  game: RevGame;
  /** The building under the character on level 0, and 0 everywhere else. */
  building: number;
}

/** One key the dungeon dispatches on. */
export interface RevKeyHandler {
  /** The function of the game the key runs, for anyone reading the table. */
  c: string;
  run(turn: RevTurn): void | Promise<void>;
}

/** The keys 1000:0CD2 dispatches on, by the byte it compares. */
export const REV_KEY_HANDLERS: Record<number, RevKeyHandler> = {
  [REV_KEY.down]: { c: '1000:0DE0, the ladder down and the false floor', run: goDown },
  [REV_KEY.up]: { c: '1000:0DAF, the ladder up and the rope into a building', run: goUp },
  [REV_KEY.stats]: { c: '1000:19F7, view_stats', run: showStats },
  [REV_KEY.quit]: { c: '1000:0D7D, the save and the chain back to BEGIN', run: quitAndSave },
  [REV_KEY.escape]: { c: '1000:10BE, the movement-mode switch', run: switchArrows },
  [REV_KEY.cast]: { c: '1000:35AC, cast a spell', run: (turn) => notBuiltYet(turn, 'cast a spell') },
  [REV_KEY.magic]: { c: '1000:3B16, the magic items owned', run: (turn) => notBuiltYet(turn, 'list the magic items you own') },
  [REV_KEY.item]: { c: '1000:1340, use an item', run: (turn) => notBuiltYet(turn, 'use a magic item') },
  [REV_KEY.abandon]: { c: '1000:1918, drop all the coins', run: (turn) => notBuiltYet(turn, 'drop all of your coins') },
  [REV_KEY.help]: { c: '1000:C332, the help pages', run: (turn) => notBuiltYet(turn, 'open the help pages') },
  [REV_KEY.f1]: { c: '1000:C332, the help pages', run: (turn) => notBuiltYet(turn, 'open the help pages') },
  [REV_KEY.pause]: { c: '1000:7FFB, the pause screen', run: (turn) => notBuiltYet(turn, 'stop everything until a key') },
  [REV_KEY.enterDelay]: { c: '1000:0F00, the enter delay', run: (turn) => notBuiltYet(turn, 'set the delay between redraws') },
  [REV_KEY.pill]: { c: '1000:7C49, take a pill', run: (turn) => notBuiltYet(turn, 'take a pill') },
  [REV_KEY.wand]: { c: '1000:7AA1, use a wand', run: (turn) => notBuiltYet(turn, 'use a wand') },
  [REV_KEY.background]: { c: '1000:0FF5, the background colour', run: (turn) => notBuiltYet(turn, 'step the background colour on') },
  [REV_KEY.palette]: { c: '1000:102A, the palette', run: (turn) => notBuiltYet(turn, 'swap the two CGA palettes') },
  [REV_KEY.sound]: { c: '1000:1055, the sound', run: (turn) => notBuiltYet(turn, 'turn the sound on and off') },
};

/** 1000:10BE: Escape counts the movement mode 0, 1, 0. */
function switchArrows(turn: RevTurn): void {
  turn.game.arrowMode = (turn.game.arrowMode + 1) % 2;
}

/** A key whose function this port has not built, saying what the game would have done. */
function notBuiltYet(turn: RevTurn, what: string): void {
  turn.game.say(...REV_NOT_BUILT(what));
}

/** 1000:0DE0: D takes a ladder down, and the false floor a chute left behind. */
function goDown(turn: RevTurn): void {
  const game = turn.game;
  if (game.feature < 1 || game.feature > 3) return;
  turn.session.enterLevel(game.pc.dungeonLevel + game.feature);
}

/** 1000:0DAF: U takes a ladder up, or climbs the rope into a town building. */
async function goUp(turn: RevTurn): Promise<void> {
  const game = turn.game;
  if (turn.building > 0 && game.pc.dungeonLevel === 0) {
    await enterBuilding(turn, turn.building);
    return;
  }
  if (game.feature >= 0) return;
  turn.session.enterLevel(game.pc.dungeonLevel + game.feature);
}

/** 1000:132A: `ON building GOTO`, the seven routines the ten squares lead to. */
async function enterBuilding(turn: RevTurn, building: number): Promise<void> {
  const desk = turn.session.desk();
  if (building >= 1 && building <= 3) await revStayAtInn(turn.game, building - 1, desk);
  else if (building === 4) await revVisitBank(turn.game, desk);
  else if (building === 5) await revVisitTemple(turn.game, desk);
  else if (building === 6) await revVisitStore(turn.game, desk);
  else if (building === 7) await revVisitGuild(turn.game, desk);
}

/** 1000:19F7: the statistics screen. */
function showStats(turn: RevTurn): void {
  const pc = turn.game.pc;
  turn.game.say(
    `Player level: ${Math.trunc(pc.level)}`,
    `Experience: ${Math.trunc(pc.experience + revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE))}`,
    `Health points: ${Math.trunc(pc.hp)} of ${Math.trunc(pc.maxHp)}`,
    `Spell points: ${Math.trunc(pc.spellPoints)}`,
    `Player weight: ${Math.trunc(pc.weight)}`,
    `Pocket money: ${Math.trunc(pc.money)}`,
    `Money in bank: ${Math.trunc(pc.bank)}`,
    pc.cls === 1 ? ' FIGHTER' : ' WIZARD',
  );
}

/** 1000:0D7D: Q saves everything and goes back to BEGIN. */
function quitAndSave(turn: RevTurn): void {
  turn.session.save();
  turn.session.over = true;
  turn.game.over = true;
}

/** The keys the fight prompt takes and the dungeon does not (1000:87CA onwards). */
async function fightKey(session: RevGameSession, key: number): Promise<void> {
  const game = session.game;
  const weapon = revWeaponFor(key);
  if (weapon === null) {
    if (key === REV_KEY.breathe) game.say(...REV_NOT_BUILT('breathe fire while the potion holds'));
    else if (key === REV_KEY.pause) game.say(...REV_NOT_BUILT('pray'));
    else if (key === REV_KEY.cast) game.say(...REV_NOT_BUILT('cast a spell'));
    else if (key === REV_KEY.item) game.say(...REV_NOT_BUILT('use a magic item'));
    else if (key === REV_KEY.pill) game.say(...REV_NOT_BUILT('take a pill'));
    else if (key === REV_KEY.wand) game.say(...REV_NOT_BUILT('use a wand'));
    return;
  }
  if (!revOwnsWeapon(game.pc, weapon)) {
    game.say(...NO_SUCH_WEAPON);
    return;
  }
  const swing = revSwing(game, weapon);
  game.banner = [swing.damage === 0 ? 'YOU MISSED' : 'NICE SWING!', `YOU DID ${swing.damage} POINT${swing.damage === 1 ? '.' : 'S.'}`];
  const fight = game.fight;
  if (fight && fight.hitPoints < 1) {
    revKillMonster(game);
    return;
  }
  // 1000:8E44 and 1000:878E: the monster's own swing, which is only ever reached from here.
  if (revMonsterAnswers(game)) revMonsterAttack(game);
}

/**
 * The loop. It comes back when the character quits or dies, which is where the original chains
 * back to BEGIN or to the hall of fame.
 */
export async function runRevDungeon(session: RevGameSession): Promise<void> {
  const game = session.game;
  const pc = game.pc;
  for (;;) {
    session.takeEdits();
    if (session.over) return;
    if (pc.hp < 0) {
      if (!revDie(game)) {
        session.die();
        return;
      }
      session.enterLevel(0);
    }
    // 1000:05F2: the facing is brought back into 1 to 4 at the top of every pass.
    pc.facing = revWrapFacing(pc.facing);
    game.memory.markStep(pc.column, pc.row, pc.dungeonLevel);
    game.feature = revFeatureUnder(pc.column, pc.row, pc.dungeonLevel);
    if (game.feature === 0) {
      // 1000:552B sends a chute straight to the fall rather than putting a prompt up.
      revFallDownAChute(game, () => session.save());
      session.enterLevel(pc.dungeonLevel);
      continue;
    }
    revLookDown(game);
    game.advice = revAdvice(game);
    const turn: RevTurn = { session, game, building: revBuildingUnder(pc.column, pc.row, pc.dungeonLevel) };
    // 1000:08F6 and 1000:0946: a monster on the character's own square opens a fight.
    if (game.fight === null && session.monsterHere() > 0) revMeetMonster(game, session.monsterHere());
    const key = game.fight === null ? await session.poll() : await session.key();
    if (key === REV_RECORD_EDITED || key === REV_CLOCK_TICK) continue;
    // The words the last key printed come down when the next one arrives, which is what the
    // redraw at 1000:3029 does to them.
    game.said = [];
    game.banner = [];
    session.run?.dispatched(key);
    if (game.fight !== null) {
      await fightKey(session, key);
      if (session.over) return;
      continue;
    }
    const handler = REV_KEY_HANDLERS[key];
    if (handler) await handler.run(turn);
    else await stepOrTurn(session, key);
    if (session.over) return;
  }
}

/** 1000:0AC2: what the arrows do, which depends on the movement mode Escape switches. */
async function stepOrTurn(session: RevGameSession, key: number): Promise<void> {
  const game = session.game;
  const pc = game.pc;
  if (game.arrowMode === 0) {
    const facing = revCompassArrow(key);
    if (facing === 0) return;
    pc.facing = facing;
    revStep(game, facing);
    return;
  }
  const arrow = revTurningArrow(key);
  if (arrow === null) return;
  if (arrow.step) revStep(game, pc.facing);
  else pc.facing += arrow.turn;
}
